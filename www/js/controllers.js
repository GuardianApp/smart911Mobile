angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, $ionicPopup, $http, $log, apiUrl) {
    $scope.lat = 0;
    $scope.long = 0;
    $scope.status = "Esperando";
    
  $ionicLoading.show({
      template: 'Ubicando...'
  });

  $scope.triggerPanicControl = function () {
      
      var watchOptions = {
          timeout: 3000,
          enableHighAccuracy: false // may cause errors if true
      };
      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(null,
        function (err) {
          alert("Error al mandar la peticion:" + err);
          console.log( JSON.stringify(err) );
        },
        function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var final = "SRID=4326;POINT (" + long + " " + lat + ")";
            var conAjax = $http.post(apiUrl + "/denuncias/track", {punto: final})
            .then(function (respuesta) {
//                console.log(respuesta);
//                alert("si entro al succes");
                $scope.status = "Enviado";
            }, function(err){
                $scope.status = "Error";
//                $scope.status = JSON.stringify(err);
                
            });
            $scope.status = "";
        });
  };


  $scope.$on('mapInitialized', function (event, map) {
      $scope.map = map;

      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
              .then(function (position) {
                  console.log(position);
                  $ionicLoading.hide();
                  map.setCenter({'lat': position.coords.latitude, 'lng': position.coords.longitude});
                  var marker = new google.maps.Marker({
                      position: {'lat': position.coords.latitude, 'lng': position.coords.longitude},
                      map: map,
                      title: 'Hello World!'
                  });


              }, function (err) {
                  // error
                  $ionicLoading.hide();
                  if (JSON.stringify(err) === '{}') {
                      $ionicPopup.alert({
                          title: 'Error GPS',
                          template: 'Parece que su dispositvo tiene apagado el GPS. Actívelo para continuar'
                      });
                  } else {
                      alert('GEO GET --> ' + JSON.stringify(err));
                  }
              });

  });

  $scope.locateMeOnMap = function(){
    $ionicLoading.show({
      template: 'localizando...'
    });

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $ionicLoading.hide();
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //creating the marker
      var marker = new google.maps.Marker({
        title : 'Usted esta aqui',
        map : $scope.map,
        position : pos,
        visible: false
      });
      //cambiando el centro a ubicación usuario        
      $scope.map.setCenter(pos);
    }, function(err) {
      // error
      $ionicLoading.hide();
      if( JSON.stringify(err) === '{}' ){
        $ionicPopup.alert({
         title: 'Error GPS',
         template: 'Parece que su dispositvo tiene apagado el GPS. Actívelo para continuar'
       });
      }else{
        alert('GEO GET --> ' + JSON.stringify(err));
      }
    });

  };

})

.controller('DenunciasCtrl', function($scope, $cordovaGeolocation, $ionicLoading, DenunciasService){

  $scope.EnviarDenuncia = function(tipo){

    $ionicLoading.show({
      template: 'Espere obtenenos su ubicacion...'
    });

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $ionicLoading.hide();

      DenunciasService.denunciar(tipo, {
        'lat' : position.coords.latitude, 
        'lon' : position.coords.longitude
      }).then(function(resp){
        alert('Su denuncia se ha recibido');
      }, function(err){
        alert('Error');
        console.log( JSON.stringify(err) );
      });

    }, function(err) {
      // error
      $ionicLoading.hide();
      if( JSON.stringify(err) === '{}' ){
        $ionicPopup.alert({
         title: 'Error GPS',
         template: 'Parece que su dispositvo tiene apagado el GPS. Actívelo para continuar'
       });
      }else{
        alert('GEO GET --> ' + JSON.stringify(err));
      }
    });

  }

})

.controller('AccountCtrl', function($scope, $cordovaContacts, $ionicPlatform, $log) {
  
  $scope.contacts = [];

  $scope.pickContactUsingNativeUI = function () {
    $cordovaContacts.pickContact().then(function (contactPicked) {
      $scope.contacts.push(contactPicked);
    });
  }

});
