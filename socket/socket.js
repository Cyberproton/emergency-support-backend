const { ToadScheduler, SimpleIntervalJob, Task } = require('toad-scheduler')
const geolib = require('geolib')
const authSocket = require('../middlewares/auth_socket')
const storage = require('../utils/storage')
const Case = require('../models/Case')
const User = require('../models/User')

const scheduler = new ToadScheduler()

const handleIO = (io) => {
    io.use(authSocket.checkAuthSocket)

    io.on('connection', (socket) => {
      console.log('User ' + socket.user + ' connected with socket id = ' + socket.id)

      socket.on('disconnect', (socket) => {
        console.log('A user disconnected with socket id = ' + socket.id)
        delete storage.socketIds[socket.user]
      })
      
      socket.on('startEmergency', async () => {
        const username = socket.user
        const existingCase = storage.cases[username]
        if (existingCase) {
          console.log('User ' + socket.user + ' restart emergency with socket id = ' + socket.id)
          socket.emit('caseCreated', existingCase)
          return
        }
        // Victim call
        const c = new Case({ caller: username, volunteers: [] })
        await c.populate('caller').populate('volunteer').execPopulate()
        await c.save()
        console.log('User ' + socket.user + ' start emergency with socket id = ' + socket.id)
        socket.emit('caseCreated', c)
        storage.cases[username] = c
        storage.notifications[c._id] = []

        // Volunteer notification
        const victim = await User.findById(username).exec()
        victim.password = ''

        findTask(io, c, victim) 
        const task = new Task(c._id, () => {
          findTask(io, c, victim) 
          volunteerUpdateTask(io, c, victim)
        })
        const job = new SimpleIntervalJob({ seconds: 10 }, task, c._id)
        job.start()
        
        storage.findTasks[c._id] = job
      })
    
      socket.on('stopEmergency', async (c) => {
        console.log('User ' + socket.user + ' stop emergency with socket id = ' + socket.id)
        const username = socket.user
        
        let cs = null
        try {
          cs = await Case.findById(c._id).exec()
          if (cs.caller !== username) {
            return
          }
          cs.is_closed = true
          await cs.save()
        } catch (err) {
          console.log(err)
        }

        job = storage.findTasks[cs._id]
        if (job) {
          console.log('Job for case ' + cs._id + ' is cancelled')
          job.stop()
        }

        cs = await cs.populate('caller').populate('volunteers').execPopulate()
        const notified = storage.notifications[cs._id]
        console.log(notified)
        if (notified) {
          notified.forEach(username => {
            const sid = storage.socketIds[username]
            if (sid) {
              socket.to(sid).emit('caseClosed', cs)
            }
            delete storage.cases[username]
          })
        }
        
        delete storage.notifications[cs._id]
        delete storage.cases[username]
        delete storage.findTasks[cs._id]
      })

      socket.on('acceptVolunteer', async (cs) => {
        const username = socket.user
        let c = null
        let volunteer = null
        try {
           volunteer = await User.findById(username).exec()
           c = await Case.findById(cs._id).exec()
           if (c.is_closed) {
            await c.populate('caller').populate('volunteers').execPopulate()
            const victim = c.caller
            const sidv = storage.socketIds[victim._id]
            io.to(sidv).emit('volunteerAccept', volunteer, c)
            return
           }
           c.volunteers.push(volunteer._id)
           await c.save()
           await c.populate('caller').populate('volunteers').execPopulate()
           storage.cases[username] = c
        } catch (err) {
          console.log(err)
        }
        const victim = c.caller
        const sidv = storage.socketIds[victim._id]
        io.to(sidv).emit('volunteerAccept', volunteer, c)
      })

      socket.on('stopVolunteer', async (c) => {
        const username = socket.user
        const volunteer = await User.findById(username).exec()
        const cs = await Case.findById(c._id).exec()
        console.log(1)
        if (cs.is_closed) {
          const victim = cs.caller
          const sidv = storage.socketIds[victim]
          await cs.populate('caller').populate('volunteers').execPopulate()
          io.to(sidv).emit('volunteerStop', volunteer, cs)
          return
        }
        console.log(2)
        const i = cs.volunteers.indexOf(username)
        if (i > -1) {
          cs.volunteers.splice(i, 1)
        }
        console.log(3)
        await cs.save()
        await cs.populate('caller').populate('volunteers').execPopulate()
        const victim = cs.caller
        storage.cases[victim._id] = cs
        const sidv = storage.socketIds[victim._id]
        io.to(sidv).emit('volunteerStop', volunteer, cs)
      })
    })
}

const findTask = async (io, c, v) => {
  let users = await User.find().exec()
  const cs = await Case.findById(c._id).populate('caller').populate('volunteers').exec()
  const victim = await User.findById(v._id)
  const filtered = []
  /*
  users = users.filter(user => 
    victim.username !== user.username && 
    Object.keys(storage.socketIds).includes(user.username) && 
    //!(storage.notifications[user.username] && storage.notifications[user.username].includes(c._id)) &&
    victim.currentLocation != null && user.currentLocation != null &&
    geolib.getDistance(victim.currentLocation, user.currentLocation) < c.searchRadius
  )*/

  for (const u of users) {
    console.log(u._id)
    if (victim._id === u._id) {
      continue
    }
    console.log(1)
    if (!Object.keys(storage.socketIds).includes(u._id)) {
      continue
    }
    console.log(2)
    if (victim.currentLocation == null) {
      continue
    }
    console.log(3)
    if (u.currentLocation == null) {
      continue
    }
    console.log(4)
    if (geolib.getDistance(victim.currentLocation, u.currentLocation) > c.searchRadius) {
      continue
    }
    console.log(5)
    filtered.push(u)
  }

  const n = storage.notifications[cs._id]
  if (n) {
    filtered.forEach(user => {
      const sid = storage.socketIds[user._id]
      io.to(sid).emit('victimCall', victim, cs, user)
      if (!n.includes(user._id)) {
        n.push(user._id)
      }
    })
    storage.notifications[cs._id] = n
  }
  const sidv = storage.socketIds[victim._id]
  console.log('Victim call with case id=' + c._id)
  console.log('Notification: ' + storage.notifications[cs._id])
  //io.to(storage.socketIds[victim.username]).emit('victimCall', victim, cs, user)
}

const volunteerUpdateTask = async (io, c, victim) => {
  let cs = null
  try {
    cs = await Case.findById(c._id).populate('caller').populate('volunteers').exec()
  } catch (err) {
    console.log(err)
  }
  const sidv = storage.socketIds[victim._id]
  io.to(sidv).emit('volunteerUpdate', cs)
}

module.exports = { handleIO: handleIO }