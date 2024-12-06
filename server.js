const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes")

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Hello My Buddy!')
})

app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server is running successfully on http://localhost:${port}`);
});