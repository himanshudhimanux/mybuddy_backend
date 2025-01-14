const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes")
const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes');
const instituteRoutes = require('./routes/instituteRoutes')
const batchRoutes = require('./routes/batchRoutes')
const courseRoutes = require('./routes/courseRoutes')
const subjectRoutes = require('./routes/subjectRoutes')
const locationRoutes = require('./routes/locationRoutes')
const sessionYearRoutes = require('./routes/sessionYearRoutes')
const classSessionRoutes = require('./routes/classSessionRoutes')
const batchStudentRoutes = require('./routes/batchStudentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const batchClassRoutes = require('./routes/batchClassRoutes')


const app = express();
const port = process.env.PORT || 5100;

app.use(cors({
    origin: 'https://mybuddyfrontend.netlify.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true ,
    allowedHeaders: ['Content-Type', 'Authorization'],// If you're using cookies or authentication headers
}));

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Hello My Buddy!')
})

// ========= Routes=============

app.use('/api/auth', authRoutes);
app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', instituteRoutes);
app.use('/api', batchRoutes);
app.use('/api', courseRoutes);
app.use('/api', subjectRoutes);
app.use('/api', locationRoutes);
app.use('/api', sessionYearRoutes);
app.use('/api', classSessionRoutes)
app.use('/api', batchStudentRoutes)
app.use('/api', attendanceRoutes)
app.use('/api', sessionRoutes)
app.use('/api', batchClassRoutes)

// ========= Routes end=============

app.listen(port, () => {
  console.log(`Server is running successfully on ${port}`);
});