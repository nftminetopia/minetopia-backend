const axios = require('axios');

const db = require("../configs/database.js");

const hashrateModel = require('../models/hashrate');    // to import modelconst app = express();

//----to continously call api and save to database after an interval------//
// to call from lite coin api
const callLiteCoinAPI = ()=>{
  const timestamp = new Date().valueOf();

  axios.get('https://www.litecoinpool.org/api?api_key=16664bc82079c692a5f45b4c4ed93b5d')
  .then(response => {
    let data = response.data['pool'];
    hashrate = data['hash_rate'];

    let payload = {
        timestamp: timestamp,
        hashrate: hashrate
    };

    const hash = new hashrateModel(payload);

    db.connect()
    hash.save(payload)
  })
  .catch(error => {
      console.log(error);
      return '';
  });
}

setInterval(callLiteCoinAPI, 600000);

// to get starttime for distinct timespans
const getStartTime = (placeholder) =>{
    let defaultStart =  1288004958000; // start timestamp
    let start = defaultStart;
    const timestamp = new Date().valueOf();

    // to calculate miliseconds against timespans,
    const ms_day = 24*60*60*1000;       // to get miliseconds in week
    const ms_week = ms_day * 7;
    const ms_month = ms_day * 30;
    const ms_year = ms_day * 365.4;
    const ms_5y = ms_year * 5;

    switch (placeholder) {
        case 'd':
            start = timestamp - ms_day;               // no of miliseconds to subtract
            break;
        case 'w':
            start = timestamp - ms_week;
            break;
        case 'm':
            start = timestamp - ms_month;
            break;
        case 'y':
            start = timestamp - ms_year;
            break;
        case '5y':
            start = timestamp - ms_5y;
            break;
        case 'max':
            start = defaultStart;
            break;

        default:
            console.log('invalid placeholder');
            break;
    }
    return start;
}

// getdata router
const getdata = async (req, res, next) => {
    let { placeholder } = req.params;

    if(placeholder == null || placeholder == '')
        placeholder = 'd'

    let payload = {}, ltc_usd = {};

    let avg_hash = 0;

    await db.connect();
    await hashrateModel.aggregate([{ $group:{_id: null, AverageValue: { $avg: "$hashrate" }}}],
            (error, result) => {
              avg_hash = result[0].AverageValue;
            });

    const data1 = await axios.get('https://www.litecoinpool.org/api?api_key=16664bc82079c692a5f45b4c4ed93b5d')
    .then(response => {
        let data = response.data;

        let user = data['user'];
        let balance = user['unpaid_rewards'];

        let pool = data['pool']
        let hashrate = pool['hash_rate'];

        let workers = data['workers'];
        let count = 0;

        let market = data['market'];
        let price = market['ltc_usd'];

        for(w in workers){
            count = count + 1
        }

        ltc_usd = {
            "ltc_usd" : price
        }

        hashrate = Math.round(hashrate/1000000)
        hashrate = `${hashrate} MH`

        avg_hash = Math.round(avg_hash/1000000)
        avg_hash = `${avg_hash} MH`

        balance = balance.toFixed(8)

        payload = {
            "hashrate": hashrate,
            "avg_hash": avg_hash,
            "balance" : balance,
            "workers" : count
        };
    })
    .catch(error => {
        return next({code:400, msg:'Operation Failed'})
    });

    try {
      const start = getStartTime(placeholder);
    //   await db.connect();
      const history = await hashrateModel.find({"timestamp":{$gte: start}});

      body = {
          "ltc_usd" : ltc_usd,
          "stats" : payload,
          "history" : history
      }

      res.status(200);
      res.send(body)
      res.end() 
    } catch (error) {
        return next({code:400, msg:'Operation Failed'})
    }
}

// to export controller objects
module.exports = {
    getdata : getdata
}

  //////--------------------- Code for SQL Dbs-----------------------///

  // let objHash = new Hashrate();     // to initialize a hashrate model instance

  // module.exports = { hashController : hashController };

  // //----to continously call api and save to database after an interval------//
  // // to call from lite coin api
  // const callLiteCoinAPI = ()=>{
  //     const timestamp = new Date().valueOf();
  //     db.connect();

  //     axios.get('https://www.litecoinpool.org/api?api_key=16664bc82079c692a5f45b4c4ed93b5d')
  //     .then(response => {
  //         let data = response.data['user'];
  //         hashrate = data['hash_rate'];

  //         let payload = {
  //             timestamp: timestamp,
  //             hashrate: hashrate
  //         };

  //         objHash.save(payload)
  //     })
  //     .catch(error => {
  //         console.log(error);
  //         return '';
  //     });
  // }

  // setInterval(callLiteCoinAPI, 300000);

  // // getdata router
  // const getdata = async (req, res, next) => {
  //     let { placeholder } = req.params;

  //     if(placeholder == null || placeholder == '')
  //         placeholder = 'd'

  //     let dataArr = [];
  //     let payload = {}, ltc_usd = {};
  //     let [avg_hash] = await objHash.avg_hashrate(placeholder);
  //     avg_hash = parseInt(avg_hash.rows[0].avg_hashrate)   // for Postgres
  //     avg_hash = parseInt(avg_hash[0].avg_hashrate)      // for MySQL

  //     const data1 = await axios.get('https://www.litecoinpool.org/api?api_key=16664bc82079c692a5f45b4c4ed93b5d')
  //     .then(response => {
  //         let data = response.data;

  //         let user = data['user'];
  //         let hashrate = user['hash_rate'];
  //         let balance = user['unpaid_rewards'];

  //         let workers = data['workers'];
  //         let count = 0;

  //         let market = data['market'];
  //         let price = market['ltc_usd'];

  //         for(w in workers){
  //             count = count + 1
  //         }

  //         ltc_usd = {
  //             "ltc_usd" : price
  //         }

  //         hashrate = Math.round(hashrate/1000)
  //         hashrate = `${hashrate} MH`

  //         avg_hash = Math.round(avg_hash/1000)
  //         avg_hash = `${avg_hash} MH`

  //         balance = balance.toFixed(8)

  //         payload = {
  //             "hashrate": hashrate,
  //             "avg_hash": avg_hash,
  //             "balance" : balance,
  //             "workers" : count
  //         };
  //     })
  //     .catch(error => {
  //         return next({code:400, msg:'Operation Failed'})
  //     });

  //     try {
  //         const [data] = await objHash.get_data(placeholder)
  //         // const data = await objHash.get_data()    // for postgres
  //         // let rows = data.rows;                    // for postgres
  //         // rows.forEach((rowData)=>{                // for postgres

  //         data.forEach((rowData)=>{
  //                     let obj = {
  //                         id : rowData.id,
  //                         timestamp : rowData.timestamp,
  //                         hashrate : rowData.hashrate
  //                     };
  //                     dataArr.push(obj)
  //                 })

  //                 body = {
  //                     "ltc_usd" : ltc_usd,
  //                     "stats" : payload,
  //                     "history" : dataArr
  //                 }

  //                 res.status(200);
  //                 res.send(body)
  //                 res.end() 
  //     } catch (error) {
  //         console.log(error);
  //         // return next({code:400, msg:'Operation Failed'})
  //     }
  // }

  // // to export controller objects
  // module.exports = {
  //     getdata : getdata
  // }
