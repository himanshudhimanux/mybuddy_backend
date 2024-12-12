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

const corsOptions = (req, callback) => {
  const allowedOrigins = ['https://mybuddyfrontend.netlify.app', 'http://localhost:5173'];
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
      callback(null, { origin: true }); // Allow the origin
  } else {
      callback(new Error('Not allowed by CORS')); // Block others
  }
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