import express from 'express'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import leadRoutes from './routes/lead.routes.js'
import cors from "cors";

//starting the app
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://192.168.1.53:5173",
      "http://192.168.1.53:5174"
    ],
    credentials: true,
  })
);



//using the json middleware for parsing json data
app.use(express.json());

// adding auth routes
app.use('/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/leads', leadRoutes)



app.get('/health', (req, res) => {
    res.status(200).json({
        'status': 'OK'
    })
});


// error handling
// app.use(errorHandler);




export default app;
