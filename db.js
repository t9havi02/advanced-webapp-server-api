const Pool = require('pg').Pool


pool  = new Pool({
  connectionLimit : 10,
  host            : 'ec2-54-162-207-150.compute-1.amazonaws.com',
  user            : 'wuvjthewncdpim',
  password        : 'f4a2b23ba9f78064f7410c39e2068f1ca7b862d338cf4b4a67c0e1ca0b31b32b',
  database        : 'd1gqm6i9bpiv43'
});


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