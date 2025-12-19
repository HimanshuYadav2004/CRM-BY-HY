import {connect} from "mongoose";


const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI);
        console.log(`MongoDB is Connected with ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDB Connection Failed ${error.message || error}`)
        process.exit(1)
    }
};

export default connectDB;