let mysql = require('mysql');
let pool = null;
try {
  pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'ec2-54-158-222-248.compute-1.amazonaws.com',
    user            : 'hpeclwdwigmbwg',
    password        : 'c668f36867b76b66ca423538e85edf1f254efdaf029cc91e36bf9c6d4cc248f8',
    database        : 'd33pnrec03c9d8'
  });

} catch (error) {
  console.error('Mysql pool create failed');
  console.error(error);
}


const api = {
  query: (query, ...parameters) =>
  {
    let promise = new Promise(function(resolve, reject) {
      pool.query(query, ...parameters, (error, results, fields) => {
        if(error) {
          reject(error)
        };

        resolve(results);
      })
    });

    return promise;
  },
  closeAll: () => {
    pool.end();
  }
};

module.exports = api;