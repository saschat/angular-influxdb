# angular-influxdb
Angular provider to connect to an Influx DB.

### Installation:
```
bower install angular-influxdb
```

### Usage:
```
angular
  .module('yourModuleName', ['influxdb'])
  .config(function(influxdbProvider){
    influxdbProvider
      .setUsername('root')
      .setPassword('root')
      .setHost('localhost')
      .setPort('8086');
  })
  .controller('yourCtrlName', ['influxdb', 'iq',
    function(influxdb, iq){
      // direct query on resource
      influxdb.query(query_str, db)
        .$promise.then(function (result) {
        /* do something with result object */
        });
        
      var callback = function(values, columns){
        /* do something with values and column names */
      };
      // raw query
      iq.raw(query_str, db, callback);
      // select queries
      iq.selectAll(measurement, db, callback);
      iq.selectAllSince(measurement, startdate, db, callback);
      var since = '1h'; // returns values from last hour
      iq.selectAllRecent(measurement, since, db, callback);
    }
  ]);

```
