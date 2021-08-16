const mongoose = require("mongoose");
const db = mongoose.connection;

const { CONNECTION_ERROR, CONNECTED_DATABASE } = require("./constants");

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on("error", console.error.bind(console, CONNECTION_ERROR));
db.once("open", console.log.bind(console, CONNECTED_DATABASE));
