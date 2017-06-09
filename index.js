var appIni=angular.module('appIni',['ngRoute']);
appIni.config(function($routeProvider){
  $routeProvider
            .when("/", {controller: "appCtrl",controllerAs: "vm",templateUrl: "ini.html"})
            .when("/premier", {controller: "appCtrl",controllerAs: "vm",templateUrl: "premier.html"})
            .when("/cup", {controller: "appCtrl",controllerAs: "vm",templateUrl: "cup.html"})
            .when("/champions", {controller: "appCtrl",controllerAs: "vm",templateUrl: "champions.html"})
            .when("/second", {controller: "appCtrl",controllerAs: "vm",templateUrl: "second.html"})
            .when("/europaleague", {controller: "appCtrl",controllerAs: "vm",templateUrl: "europaleague.html"})
            .when("/intertoto", {controller: "appCtrl",controllerAs: "vm",templateUrl: "intertoto.html"})
            .when("/myteam", {controller: "appCtrl",controllerAs: "vm",templateUrl: "myteam.html"})
            .when("/europesupercup", {controller: "appCtrl",controllerAs: "vm",templateUrl: "europesupercup.html"})
            .when("/clubsupercup", {controller: "appCtrl",controllerAs: "vm",templateUrl: "clubsupercup.html"})
            .when("/pending", {controller: "appCtrl",controllerAs: "vm",templateUrl: "pending.html"})
            .when("/matchlog", {controller: "appCtrl",controllerAs: "vm",templateUrl: "matchlog.html"})
            .when("/resultinput", {controller: "appCtrl",controllerAs: "vm",templateUrl: "resultinput.html"});
});
appIni.controller("navCtrl", function($location){
        var map = this;
        map.estoy = function(ruta){
            return $location.path() == ruta;
        }
    })
appIni.controller("appCtrl",function(indexFactory,$http){
  var uq = this;
  uq.user = indexFactory.getUser();
  obtainData();

  uq.login = function(){
    angular.forEach(uq.users, function(value, key){
      if(value.user == uq.user.user)
      {
        if(value.pass == uq.user.pass)
        {
          uq.user.valid = true;
          uq.user.teamID = value.teamID;
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

  function obtainData(dataType){
    $http.post("SWCDataRequesting.php", { type: "recDat", type: dataType })
          .success(function(data) {
            console.log(data);
            switch (dataType)
            {
                case "U":
                    uq.users = data.users;
                    indexFactory.users = uq.users;
                    break;
                case "T":
                    uq.teams = data.teams;
                    indexFactory.teams = uq.teams;
                    break;
                case "M":
                    uq.matches = data.matches;
                    indexFactory.matches = uq.matches;
                    break;
                case "A":
                    uq.actions = data.actions;
                    indexFactory.actions = uq.actions;
                    break;
                case "P":
                    uq.players = data.players;
                    indexFactory.players = uq.players;
                    break;
                case "S":
                    uq.signins = data.signins;
                    indexFactory.signins = uq.signins;
                    break;
            }
            
            /*for (var v = 0; v < uq.vehiculos.length; v++) {
              if (uq.vehiculos[v].activo == 1) { uq.vehiculos[v].activo = true; } else { uq.vehiculos[v].activo = false; }
            }*/
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se han podido recoger los datos en la base de datos', 5000, 'rounded');
          });
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
