var appIni=angular.module('appIni',['ngRoute']);
appIni.config(function($routeProvider){
  $routeProvider
            .when("/", {controller: "appCtrl",controllerAs: "vm",templateUrl: "ini.html"})
            .when("/primera", {controller: "appCtrl",controllerAs: "vm",templateUrl: "primera.html"})
            .when("/copa", {controller: "appCtrl",controllerAs: "vm",templateUrl: "copa.html"})
            .when("/champions", {controller: "appCtrl",controllerAs: "vm",templateUrl: "champions.html"})
            .when("/segunda", {controller: "appCtrl",controllerAs: "vm",templateUrl: "segunda.html"})
            .when("/europaleague", {controller: "appCtrl",controllerAs: "vm",templateUrl: "europaleague.html"})
            .when("/intertoto", {controller: "appCtrl",controllerAs: "vm",templateUrl: "intertoto.html"})
            .when("/plantilla", {controller: "appCtrl",controllerAs: "vm",templateUrl: "plantilla.html"})
            .when("/supercopaeuropa", {controller: "appCtrl",controllerAs: "vm",templateUrl: "supercopaeuropa.html"})
            .when("/supercopaclubes", {controller: "appCtrl",controllerAs: "vm",templateUrl: "supercopaclubes.html"})
            .when("/pendientes", {controller: "appCtrl",controllerAs: "vm",templateUrl: "pendientes.html"})
            .when("/resumenpartido", {controller: "appCtrl",controllerAs: "vm",templateUrl: "resumenpartido.html"})
            .when("/introducirresultado", {controller: "appCtrl",controllerAs: "vm",templateUrl: "introducirresultado.html"})
            .when("/elegirtipo", {controller: "appCtrl",controllerAs: "vm",templateUrl: "eleccionquest.html"})
            .when("/questcena", {controller: "appCtrl",controllerAs: "vm",templateUrl: "questcena.html"});
});
appIni.controller("navCtrl", function($location){
        var map = this;
        map.estoy = function(ruta){
            return $location.path() == ruta;
        }
    })
appIni.controller("appCtrl",function(indexFactory,$http){
  var uq=this;
  uq.user=indexFactory.getUser();

  uq.login = function(){
    angular.forEach(uq.users, function(value, key){
      if(value.user == uq.user.user)
      {
        if(value.pass == uq.user.pass)
        {
          uq.user.valid = true;
          uq.user.teamID = value.id;
          uq.user.teamName = uq.getTeamById(value.id);
        }
      }
    });
    if(!uq.user.valid){
      uq.user.user = '';
      uq.user.pass = '';
      Materialize.toast('Usuario o contraseña inválida');
    }
    return uq.user.valido;
  }
});
appIni.factory("indexFactory", function(){
    var user={id:-1, user: '', pass: '', valid: false, teamName: '', teamID: -1};
    var interfaz = {
        pass:"",
        getUser: function(){
            return user;
        },
        setUser: function(newUser){
          user = newUser;
        }
    }
    return interfaz;
});
