const mongoose = require('mongoose')

const DbConnection = async () => {
    const connectDb = await mongoose.connect(process.env.MONGODB_CONNECT_URL)

    if (connectDb) {
        console.log("MongoDB Connection siccessfully ✔");
    }
}


module.exports = DbConnection