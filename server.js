const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes")
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes');
const instituteRoutes = require('./routes/instituteRoutes')


const app = express();
const port = process.env.PORT || 5100;

const corsOptions = {
  origin: (origin, callback) => {
      const allowedOrigins = [
          "https://mybuddyfrontend.netlify.app", // Your production frontend URL
          "http://localhost:3000",              // Your local development frontend
      ];

      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error("Not allowed by CORS"));
      }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true,                         // Allow credentials (cookies, auth headers)
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Hello My Buddy!')
})

app.use('/api/auth', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', instituteRoutes);


app.listen(port, () => {
  console.log(`Server is running successfully on ${port}`);
});