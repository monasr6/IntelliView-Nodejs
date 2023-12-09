const mongoose = require('mongoose');

exports.connectDB = function () {
  mongoose.connect(process.env., {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', function () {
    throw new Error('unable to connect to database at ' + config.db.uri);
  });
};
