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
const batchStudentRoutes = require('./routes/batchStudentRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const sessionRoutes = require('./routes/sessionRoutes')
const batchClassRoutes = require('./routes/batchClassRoutes');
const corsOptions = require('./utils/corsOptions');
const noticeRoutes = require('./routes/noticeRoutes')
const feeRoutes = require('./routes/feeRoutes');
const feeHistoryRoutes = require('./routes/feeHistoryRoutes');
const razorpayRoutes = require('./routes/razorpayRoutes')
const courseStudentRoutes = require('./routes/courseStudentRoutes');


const app = express();
const port = process.env.PORT || 5100;

app.use(cors(corsOptions));  // Apply CORS with the options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api', batchStudentRoutes)
app.use('/api', attendanceRoutes)
app.use('/api', sessionRoutes)
app.use('/api', batchClassRoutes)
app.use('/api', noticeRoutes)
app.use("/api", feeRoutes);
app.use("/api", feeHistoryRoutes);
app.use("/api", razorpayRoutes);
app.use("/api", courseStudentRoutes)


// ========= Routes end=============

app.listen(port, () => {
  console.log(`Server is running successfully on ${port}`);
});