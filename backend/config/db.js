const mongoose = require('mongoose');

const dbURI = "mongodb+srv://infosales:kauakaua@lojasimples.2dcnj.mongodb.net/lojasimples?retryWrites=true&w=majority&appName=lojasimples";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
  } catch (err) {
    console.error("Erro ao conectar no MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;