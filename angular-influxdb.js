(function(){

'use strict';

angular.module('influxdb', ['ngResource'])
  .provider('influxdb', function () {
    var user = 'root';
    var pwd = 'root';
    var host = 'localhost';
    var port = '8086';
    var ssl = false;
    var version = 0.9;
    return {
      setUsername: function (username) {
        user = username;
        return this;
      },
      setPassword: function (password) {
        pwd = password;
        return this;
      },
      setHost: function (hst) {
        host = hst;
        return this;
      },
      setPort: function (prt) {
        port = prt;
        return this;
      },
      setVersion: function (ver) {
        version = ver;
        return this;
      },
       setSSL: function (s) {
        ssl = s;
        return this;
      },    
      $get: function ($resource) {
        var getVersion = function(){
          return version;
        };
        if(version < 0.9){
          return {
            getVersion: getVersion,
            query: function(query, db){
              var url =
                (ssl ? 'https' : 'http') + '://' + host + ':' + port +
                '/db/' + db + '/series?' +
                'u=' + user + '&p=' + pwd +
                '&q=' + query;

              return $resource(url).query();
            }
          }
        }
        else{
          return {
            getVersion: getVersion,
            query: function(query, db){
              var url =
                (ssl ? 'https' : 'http') + '://' + host + ':' + port +
                '/query?q=' + query + '&db=' + db +
                '&u=' + user + '&p=' + pwd;
              return $resource(url).get();
            }
          }
        }
      }
    };
  })
  .factory('iq', ['influxdb', function(influxdb){
    return {
      raw: function(query_str, db, callback){
        var version = influxdb.getVersion();
        influxdb.query(query_str, db)
          .$promise.then(function (result) {
            var values = [];
            var columns = [];
            if(version < 0.9){
              if(result.length > 0) {
                values = result[0].points;
                columns = result[0].columns;
              }
            }
            else{
              if("series" in result.results[0] && "values" in result.results[0].series[0]){
                values = result.results[0].series[0].values;
                columns = result.results[0].series[0].columns;
              }
            }
            callback(values, columns);
          });
      },
      selectAll: function(measurement, db, callback){
        var query_str = "select+*+from+/" + measurement + "/";
        this.raw(query_str, db, callback);
      },
      selectAllSince: function(measurement, startdate, db, callback){
        var date = new Date(startdate);
        var query_str = "select+*+from+/" + measurement + "/+where+time+>+'" + date.toISOString() + "'";
        this.raw(query_str, db, callback);
      },
      selectAllRecent: function(measurement, since, db, callback){
        /*
        since is a string, e.g., '1h' for 1 hour.
        Options are u for microseconds, s for seconds, m for minutes, h for hours, d for days and w for weeks
         */
        var query_str = "select+*+from+/" + measurement + "/+where+time+>+now()+-+" + since;
        this.raw(query_str, db, callback);
      }
    };
  }]);

})();
