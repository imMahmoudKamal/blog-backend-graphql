import mongoose from 'mongoose';

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export function dbConnect() {
  mongoose.set('debug', true);

  return new Promise(async (resolve, reject) => {
    mongoose
      .connect(process.env.DB_URI, dbOptions)
      .then(() => resolve('db Connected and Running'))
      .catch((error) => reject(`db Error: ${error}`));
  });
}
