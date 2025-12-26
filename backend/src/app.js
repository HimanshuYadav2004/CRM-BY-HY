import express from 'express'
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import leadRoutes from './routes/lead.routes.js'
import taskRoutes from './routes/task.routes.js'
import cors from "cors";

//starting the app
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : [])
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



//using the json middleware for parsing json data
app.use(express.json());

// adding auth routes
app.use('/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);



app.get('/health', (req, res) => {
    res.status(200).json({
        'status': 'OK'
    })
});


// error handling
// app.use(errorHandler);




export default app;
