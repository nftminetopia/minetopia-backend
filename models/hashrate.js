// const db = require("../configs/database");       // to import database.js
const mongoose = require("mongoose");

const HashrateSchema = new mongoose.Schema({
    timestamp: {
        type: Number,
        default: 0,
    },
    hashrate: {
      type: Number,
      default: 0,
    },
  });

const Hashrate = mongoose.model("Hashrate", HashrateSchema);

module.exports = Hashrate;

// User model class
// module.exports = class Hashrate {
    
//     // save Hashdata
//     save({hashrate, timestamp})
//     {
//         let query = `INSERT INTO hash_data
//                 (hashrate, timestamp)
//                 values(${hashrate}, ${timestamp})`;

//         return db.query(query);
//     };

//     // get hash data
//     get_data(placeholder)
//     {
//         const start = this.getStartTime(placeholder)        // to get limit to required rows according to timespan

//         let query = `SELECT
//             * from hash_data
//             WHERE timestamp > ${start}`;

//         return db.query(query);
//     };
//     // Get Average Hashrate
//     avg_hashrate(placeholder)
//     {
//         const start = this.getStartTime(placeholder)        // to get limit to required rows according to timespan

//         let query = `SELECT
//             AVG(hashrate) as avg_hashrate from hash_data
//             WHERE timestamp > ${start}`;

//         return db.query(query);
//     };
// }