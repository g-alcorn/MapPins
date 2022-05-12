const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3300;
const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

mongoose
  .connect(process.env.MONGO_URL, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((e) => {
    console.log(`MongoDB connection error: ${e}`);
  });

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});



