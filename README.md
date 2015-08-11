# angular-influxdb
Angular provider to connect to an Influx DB.

### Usage:
```
angular
  .module('yourModuleName', ['influxdb', 'iQ'])
  .config(function(influxdbProvider){
    influxdbProvider
      .setUsername('root')
      .setPassword('root')
      .setHost('localhost')
      .setPort('8086');
  })
  .controller('yourCtrlName', ['influxdb', 'iQ',
    function(influxdb, iQ){
      // direct query on resource
      influxdb.query(query_str, db)
        .$promise.then(function (result) {
        /* do something with result object */
        });
        
      var callback = function(values, columns){
        /* do something with values and column names */
      };
      // raw query
      iQ.raw(query_str, db, callback);
      // select queries
      iQ.selectAll(measurement, db, callback);
      iQ.selectAllSince(measurement, startdate, db, callback);
      var since = '1h'; // returns values from last hour
      iQ.selectAllRecent(measurement, since, db, callback);
    }]);

```
