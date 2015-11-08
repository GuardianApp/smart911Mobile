angular.module('starter.services', ['ngResource'])

.service('DenunciasService', function($q, $resource, $ionicLoading, $log, apiUrl){

  var denunciasRes = $resource( apiUrl + '/denuncias/crear/', {
    platform : ionic.Platform.platform().toString(),
  },{ 'crear' : { 
    isArray : true,
    method : 'POST',
    withCredentials : true,
    headers : {
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest : function(obj){
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }
    }
  });

  return{
    denunciar: function(tipo, geo){
      var deferred = $q.defer();
      var promise = deferred.promise;

      denunciasRes.crear({
        'tipo' : tipo,
        'lugar' : 'SRID=4326;POINT ('+geo.lat+' '+ geo.lon +')' 
      },
      function(resp){
        $log.debug('Denuncia se a creado correctamente');
        deferred.resolve(resp);
      },
      function(err){
        $log.error( JSON.stringify(err) );
        deferred.reject("Servidor inaccesible: (" + err.status + ")(" + err.statusText + ")");
      });

      promise.success = function(fn){
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn){
        promise.then(null, fn);
        return promise;
      }

      return promise;
    }

  };

});
