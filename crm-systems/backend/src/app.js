import express from 'express'
import authRoutes from './routes/auth.routes.js'

//starting the app
const app = express();

//using the json middleware for parsing json data
app.use(express.json());

// adding auth routes
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        'status': 'OK'
    })
});


// error handling
// app.use(errorHandler);




export default app;
