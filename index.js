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
            .when("/assignteam", {controller: "appCtrl",controllerAs: "vm",templateUrl: "assignteam.html"})
            .when("/teamrequests", {controller: "appCtrl",controllerAs: "vm",templateUrl: "teamrequests.html"});
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
  uq.teamSuggested = 0;
  switch($location.path())
  {
    case "/":
        obtainData("U");
        obtainData("T");
        break;
    case "/teamrequests":
        obtainData("U");
        obtainData("T");
        obtainData("RT");
        setAvailableTeams();
        break;
  }

  uq.login = function(){
    angular.forEach(uq.users, function(value, key){
      if(value.user == uq.user.user)
      {
        if(value.pass == uq.user.pass)
        {
          uq.user.id = value.id;
          uq.user.email = value.email;
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
    }else{
      indexFactory.setUser(uq.user);
    }
    return uq.user.valido;
  }

  uq.redirEditar=function(ruta)
  {
    location.href="#/" + ruta;
  }

  uq.addZero = function(number)
  {
    if(number<10){number="0"+number;}
    return number;
  }

  uq.getUserById = function(id)
  {
    var response = {};
    angular.forEach(uq.users, function(value, index){
        if(value.id == id)
        {
            response = value;
        }
    });
    return response;
  }

  uq.getTeamById = function(id)
  {
    var response = {};
    angular.forEach(uq.teams, function(value, index){
        if(value.id == id)
        {
            response = value;
        }
    });
    return response;
  }

  uq.getMatchById = function(id)
  {
    var response = {};
    angular.forEach(uq.matches, function(value, index){
        if(value.id == id)
        {
            response = value;
        }
    });
    return response;
  }

  uq.getPlayerById = function(id)
  {
    var response = {};
    angular.forEach(uq.players, function(value, index){
        if(value.id == id)
        {
            response = value;
        }
    });
    return response;
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

  uq.requestTeam = function()
  {
    $http.post("SWCDataRequesting.php", { type: "solEqu", user: uq.user.id})
          .success(function(data) {
            Materialize.toast('Equipo solicitado. Espera respuesta de un administrador', 5000, 'rounded');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido solicitar el equipo', 5000, 'rounded');
          });
  }

  function setAvailableTeams()
  {
    var availableTeams = [];
    angular.forEach(uq.teams, function(value, key){
        var available = true;
        angular.forEach(uq.users, function(value2, key2){
            if(value.id == value2.teamID)
            {
                available = false;
            }
        });
        if(available)
        {
            availableTeams.push(value.id);
        }
    });
    return availableTeams;
  }

  function obtainData(dataType){
    $http.post("SWCDataRequesting.php", { type: "recDat", dataType: dataType })
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
                    for (var v = 0; v < uq.teams.length; v++) {
                      uq.teams[v].id = parseInt(uq.teams[v].id);
                    }
                    break;
                case "M":
                    uq.matches = data.matches;
                    indexFactory.matches = uq.matches;
                    for (var v = 0; v < uq.matches.length; v++) {
                      uq.matches[v].id = parseInt(uq.matches[v].id);
                    }
                    break;
                case "A":
                    uq.actions = data.actions;
                    indexFactory.actions = uq.actions;
                    break;
                case "P":
                    uq.players = data.players;
                    indexFactory.players = uq.players;
                    for (var v = 0; v < uq.players.length; v++) {
                      uq.players[v].id = parseInt(uq.players[v].id);
                    }
                    break;
                case "S":
                    uq.signins = data.signins;
                    indexFactory.signins = uq.signins;
                    for (var v = 0; v < uq.signins.length; v++) {
                      uq.signins[v].id = parseInt(uq.signins[v].id);
                      uq.signins[v].player = parseInt(uq.signins[v].player);
                    }
                    break;
                case "PCS":
                    uq.playerChangeSignins = data.playerChangeSignins;
                    indexFactory.playerChangeSignins = uq.playerChangeSignins;
                    break;
                case "TO":
                    uq.tournaments = data.tournaments;
                    indexFactory.tournaments = uq.tournaments;
                    for (var v = 0; v < uq.tournaments.length; v++) {
                      uq.tournaments[v].id = parseInt(uq.tournaments[v].id);
                      uq.tournaments[v].edition = parseInt(uq.tournaments[v].edition);
                    }
                    break;
                case "ST":
                    uq.standings = data.standings;
                    indexFactory.standings = uq.standings;
                    for (var v = 0; v < uq.standings.length; v++) {
                      uq.standings[v].id = parseInt(uq.standings[v].id);
                    }
                    break;
                case "RT":
                    uq.teamRequests = data.teamRequests;
                    indexFactory.teamRequests = uq.teamRequests;
                    for (var v = 0; v < uq.teamRequests.length; v++) {
                      uq.teamRequests[v].user = parseInt(uq.teamRequests[v].user);
                      uq.teamRequests[v].requestDate = new Date(uq.teamRequests[v].requestDate);
                    }
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
    var user={id:-1, user: '', pass: '', email:'', valid: false, teamName: '', teamID: -1, teamImage: ''};
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
