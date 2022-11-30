const mongoose = require("mongoose");

const connect = async () => {
  await mongoose.connect(
    "mongodb+srv://root:brownfox@cluster0.3ekr1kt.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("DB Connected");
};

module.exports = { connect };

// const mySQL = require('mysql2') // uncomment to flip MySQL

// db connection using pool for PostGres
// const { Pool } = require("pg");

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "db_minetopia",
//     password: "startadventure",
//     port: 5432
//   });

// db connection using pool for MySQL

// const pool = mySQL.createPool({
//     host : "localhost",
//     user : "root",
//     password : "",
//     database : "minor_data",
//     waitForConnections: true,
//     connectionLimit: 20,
//     queueLimit: 0
// });

// module.exports = pool.promise();
