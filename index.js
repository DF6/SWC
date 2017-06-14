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
            .when("/resultinput", {controller: "appCtrl",controllerAs: "vm",templateUrl: "resultinput.html"})
            .when("/register", {controller: "appCtrl",controllerAs: "vm",templateUrl: "register.html"})
            .when("/assignteam", {controller: "appCtrl",controllerAs: "vm",templateUrl: "assignteam.html"});
});
appIni.controller("navCtrl", function($location){
        var map = this;
        map.estoy = function(ruta){
            return $location.path() == ruta;
        }
    })
appIni.controller("appCtrl",function(indexFactory, $http, $location){
  var uq = this;
  uq.user = indexFactory.getUser();
  switch($location.path())
  {
    case "/":
        obtainData("U");
        obtainData("T");
        break;
    
  }

  uq.login = function(){
    angular.forEach(uq.users, function(value, key){
      if(value.user == uq.user.user)
      {
        if(value.pass == uq.user.pass)
        {
          uq.user.id = value.id;
          uq.user.valid = true;
          uq.user.teamID = value.teamID;
          uq.user.teamName = uq.getTeamById(value.id);
        }
      }
    });
    if(!uq.user.valid){
      uq.user.user = '';
      uq.user.pass = '';
      Materialize.toast('Usuario o contraseña inválida', 5000, 'rounded');
    }
    return uq.user.valido;
  }

  uq.getUserById = function(id)
  {
    angular.forEach(uq.users, function(value, index){
        if(value.id == id)
        {
            return value;
        }
    });
    if(id!=-1){
        Materialize.toast('No existe el usuario', 5000, 'rounded');
    }
  }

  uq.getTeamById = function(id)
  {
    angular.forEach(uq.teams, function(value, index){
        if(value.id == id)
        {
            return value;
        }
    });
    if(id!=-1){
      Materialize.toast('No existe el equipo', 5000, 'rounded');
    }
  }

  uq.getMatchById = function(id)
  {
    angular.forEach(uq.matches, function(value, index){
        if(value.id == id)
        {
            return value;
        }
    });
    if(id!=-1){
      Materialize.toast('No existe el partido', 5000, 'rounded');
    }
  }

  uq.getPlayerById = function(id)
  {
    angular.forEach(uq.players, function(value, index){
        if(value.id == id)
        {
            return value;
        }
    });
    if(id!=-1){
      Materialize.toast('No existe el jugador', 5000, 'rounded');
    }
  }

  uq.getActionsByMatch = function(matchID)
  {
    var matchActions = [];
    angular.forEach(uq.actions, function(value, index){
        if(value.matchID == matchID)
        {
            matchActions.push(value);
        }
    });
    return matchActions;
  }

  function obtainData(dataType){
    $http.post("SWCDataRequesting.php", { type: "recDat", type: dataType })
          .success(function(data) {
            switch (dataType)
            {
                case "U":
                    uq.users = data.users;
                    indexFactory.users = uq.users;
                    for (var v = 0; v < uq.users.length; v++) {
                      uq.users[v].id = parseInt(uq.users[v].id);
                      uq.users[v].teamID = parseInt(uq.users[v].teamID);
                    }
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
                case "PCS":
                    uq.playerChangeSignins = data.playerChangeSignins;
                    indexFactory.playerChangeSignins = uq.playerChangeSignins;
                    break;
                case "TO":
                    uq.tournaments = data.tournaments;
                    indexFactory.tournaments = uq.tournaments;
                    break;
                case "ST":
                    uq.standings = data.standings;
                    indexFactory.standings = uq.standings;
                    break;
            }
            
            
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se han podido recoger los datos', 5000, 'rounded');
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
