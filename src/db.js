import mongoose from 'mongoose';

export default {
  connect: (DB_HOST) => {
    // Connect to the DB
    mongoose
      .connect(DB_HOST)
      .then(() => {
        console.log('Connected to MongoDB!');
      })
      .catch((err) => {
        console.error(err);
      });
  },
  close: () => {
    mongoose.connection.close();
  },
};
