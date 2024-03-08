const mongoose = require('mongoose')

const dbConnect = async () => {
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD
    const mongoUri = `mongodb+srv://ansarism70:${MONGO_PASSWORD}@cluster0.bf5snxf.mongodb.net/?retryWrites=true&w=majority`

    try {
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true, // Use the new topology engine
            useNewUrlParser: true, // Not strictly necessary, but you can keep it
        })

        console.log('mongodb connected', connect.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = {
    dbConnect
}