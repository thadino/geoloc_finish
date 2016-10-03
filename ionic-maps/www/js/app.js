// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicModal, $http) {

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var lyngbyStation = new google.maps.LatLng(55.76838988, 12.50313878);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };


    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

	//Wait until the map is loaded
google.maps.event.addListenerOnce($scope.map, 'idle', function(){

  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });

  var infoWindow = new google.maps.InfoWindow({
      content: "Here I am!"
  });

  google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open($scope.map, marker);
  });


  var marker2 = new google.maps.Marker({
    map: $scope.map,
    animation: google.maps.Animation.DROP,
    position: lyngbyStation
  });

  var infoWindow2 = new google.maps.InfoWindow({
    content: "Lyngby St."
  });

  google.maps.event.addListener(marker2, 'click', function () {
    infoWindow2.open($scope.map, marker2);
  });

});

  }, function(error){
    console.log("Could not get location");
  });

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


  $scope.user = {};
  $scope.registerUser = function (user) {
    $scope.modal.hide();
    console.log("1: " + user.userName);
    console.log("2: " + user.distance);
    user.loc = {type: "Point", coordinates: []}; //GeoJSON point
    user.loc.coordinates.push(12.511813); //Observe that longitude comes first
    user.loc.coordinates.push(55.770319); //in GEoJSON
    // {"userName":"Donald Duck","loc": { "type": "Point","coordinates": [12.511813,55.770319]}}
    console.log(JSON.stringify(user));
    $http({
      method: "POST",
      url: " http://ionicboth-plaul.rhcloud.com/api/friends/register/"+user.distance,
      data: user
    }).success(function (data, status, headers, config) {

      // for (var key in data) {
      //   if(data[key].loc)
      //   {
      //     for (var key2 in data[key].loc) {
      //       console.log(key2, data[key].loc[key2])
      //     }
      //   }
      //   else
      //   {
      //   console.log(key, data[key]);
      //   }
      // }

      for (var key in data) {
        newmarker(data[key])
      }



    })


  }



  function newmarker(data){
console.log(data);
console.log(data.loc.coordinates[1]);
    var posi = new google.maps.LatLng(data.loc.coordinates[1], data.loc.coordinates[0]);


  var marker3 = new google.maps.Marker({
    map: $scope.map,
    animation: google.maps.Animation.DROP,
    position: posi
  });

  var infoWindow3 = new google.maps.InfoWindow({
    content: data.userName
  });

  google.maps.event.addListener(marker3, 'click', function () {
    infoWindow3.open($scope.map, marker3);
  });
  }


});



