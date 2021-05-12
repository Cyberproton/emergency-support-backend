const mongoose = require('mongoose')

const connector = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true
        })
        console.log('[MongoDB Connector] Connected successfully.')
    }
    catch (error) {
        console.log('[MongoDB Connector] Something goes wrong. Could not connect')
        console.error(error)
        process.exit(1)
    }
}

module.exports = connector