var index=angular.module('index',['ngRoute']);
index.config(function($routeProvider){
  $routeProvider
            .when("/", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "ini.html"})
            .when("/primera", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "primera.html"})
            .when("/copa", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "copa.html"})
            .when("/champions", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "champions.html"})
            .when("/segunda", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "segunda.html"})
            .when("/europaleague", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "europaleague.html"})
            .when("/intertoto", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "intertoto.html"})
            .when("/plantilla", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "plantilla.html"})
            .when("/supercopaeuropa", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "supercopaeuropa.html"})
            .when("/supercopaclubes", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "supercopaclubes.html"})
            .when("/pendientes", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "pendientes.html"})
            .when("/resumenpartido", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "resumenpartido.html"})
            .when("/introducirresultado", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "introducirresultado.html"})
            .when("/elegirtipo", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "eleccionquest.html"})
            .when("/questcena", {controller: "indexCtrl",controllerAs: "vm",templateUrl: "questcena.html"});
});
index.controller("navindex", function($location){
        var map = this;
        map.estoy = function(ruta){
            return $location.path() == ruta;
        }
})
index.controller("indexCtrl",function(indexFactory, $http){
  var uq=this;
  uq.preguntas=indexFactory.getPreguntas();
  uq.user=indexFactory.user;
});
index.factory("indexFactory", function(){
    var user={id:-1, user: '', pass: ''};
    var interfaz = {
        pass:"",
        getUser: function(){
            return user;
        },
        setUser: function(newUser){
          user=newUser;
        }
    }
    return interfaz;
});
