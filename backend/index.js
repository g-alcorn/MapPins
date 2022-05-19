const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3300;
const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

const pinRoutes = require('./routes/pins');
const userRoutes = require('./routes/users');

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((e) => {
    console.log(`MongoDB connection error: ${e}`);
  });

app.use(express.json());

app.use('/api/pins', pinRoutes);

app.use('/api/users', userRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/build'));
}

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
