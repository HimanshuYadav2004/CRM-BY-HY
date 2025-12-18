import dotenv from 'dotenv'
dotenv.config()
import app from '../backend/src/app.js'
import connectDB from '../backend/src/config/db.js'


const PORT = process.env.PORT || 5000

connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`)
});




