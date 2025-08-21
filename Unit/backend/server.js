const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/training', require('./routes/trainingRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/course', require('./routes/coursesRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

