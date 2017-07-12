// offers.html, makeoffer.html, index.js, SWCDataRequesting.php incluir jugadores ofrecidos
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
            .when("/salary", {controller: "appCtrl",controllerAs: "vm",templateUrl: "salary.html"})
            .when("/otherteams", {controller: "appCtrl",controllerAs: "vm",templateUrl: "otherteams.html"})
            .when("/makeoffer", {controller: "appCtrl",controllerAs: "vm",templateUrl: "makeoffer.html"})
            .when("/marketresume", {controller: "appCtrl",controllerAs: "vm",templateUrl: "marketresume.html"})
            .when("/wildcards", {controller: "appCtrl",controllerAs: "vm",templateUrl: "wildcards.html"})
            .when("/offers", {controller: "appCtrl",controllerAs: "vm",templateUrl: "offers.html"})
            .when("/auctions", {controller: "appCtrl",controllerAs: "vm",templateUrl: "auctions.html"})
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
    });
appIni.controller("appCtrl",function(indexFactory, $http, $location, $timeout){
  const INTOCABLES = 2;
  const CLAUSULAS = 3;
  const MARKET_EDITION = 1;
  var uq = this;
  uq.datoViajero = indexFactory.datoViajero;
  uq.user = indexFactory.getUser();
  uq.teamPlayers = [];
  uq.salaryLimit = 0;
  uq.salaryRange = 0;
  uq.offerLimit = 0;
  uq.offerRange = 0;
  uq.teamSelected = '';
  uq.playerSelected = '';
  uq.playersOffered = [];
  uq.showMarket=true;
  uq.counters = [];
  uq.temporary = false;
  obtainData("T");
  switch($location.path())
  {
    case "/":
        obtainData("U");        
        break;
    case "/teamrequests":
        obtainData("U");        
        obtainData("RT");
        break;
    case "/myteam":
        obtainData("U");        
        obtainData("P");
        break;
    case "/otherteams":
        obtainData("U");        
        obtainData("P");
        break;
    case "/salary":        
        obtainData("P");
        break;
    case "/makeoffer":        
        obtainData("P");
        break;
    case "/offers":        
        obtainData("P");
        obtainData("S");
        obtainData("PCS");
        break;
    case "/auctions":        
        obtainData("P");
        obtainData("S");
        obtainData("CAL");
        uq.onTimeout = function(){
            angular.forEach(uq.counters, function(value, key){
              value.counter-=1000;
            });
            uq.showDateFromCounters();
            uq.mytimeout = $timeout(uq.onTimeout,1000);
        }
        uq.mytimeout = $timeout(uq.onTimeout,1000);
        break;
    case "/marketresume":        
        obtainData("P");
        obtainData("S");
        obtainData("PCS");
        break;
    case "/wildcards":        
        obtainData("P");
        obtainData("S");
        break;
    default:
        obtainData("U");        
        obtainData("P");
        obtainData("RT");
        obtainData("M");
        obtainData("A");
        obtainData("S");
        obtainData("TO");
        obtainData("ST");
        obtainData("PCS");
        break;
  }

  uq.execCronJob = function()
  {
    $http.post("cronjobs.php", {})
              .success(function(data) {
                Materialize.toast('Bien', 5000, 'rounded');
              })
              .error(function(error) {
                console.log(error);
                Materialize.toast('Mal', 5000, 'rounded');
              });
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

  uq.register = function(){
    if(uq.user.pass.length >= 8)
    {
      if(uq.user.pass == uq.user2)
      {
        var response = userExists(uq.user.user, uq.user.email);
        if(response=='')
        {
          $http.post("SWCDataRequesting.php", { type: "regUsu", user: uq.user.user, pass: uq.user.pass, email: uq.user.email})
              .success(function(data) {
                uq.users = [];
                obtainData("U");
                Materialize.toast(uq.user.user + ', has sido registrado', 5000, 'rounded');
                location.href="#/";
                uq.login();
              })
              .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido registrar el usuario', 5000, 'rounded');
              });
        }else{
          Materialize.toast('El ' + response + ' ya existe', 5000, 'rounded');
        }
      }else{
        Materialize.toast('Las contraseñas no coinciden', 5000, 'rounded');
      }
    }else{
      Materialize.toast('La contraseña debe contener 8 caracteres', 5000, 'rounded');
    }
  }

  uq.redirEditar=function(ruta)
  {
    location.href="#/" + ruta;
  }

  uq.redirEditarConDatos=function(ruta, dato)
  {
    indexFactory.datoViajero = dato;
    uq.redirEditar(ruta);
  }

  uq.addZero = function(number)
  {
    if(number<10){number="0"+number;}
    return number;
  }

  uq.giveTeamToRequester = function(requester)
  {
    if(setAvailableTeams().length!=0)
    {
        var chosenTeam = 1 + Math.floor(Math.random()*setAvailableTeams().length);
        $http.post("SWCDataRequesting.php", { type: "givTea", user: requester, team: chosenTeam})
              .success(function(data) {
                uq.teamRequests = [];
                obtainData("RT");
                Materialize.toast(uq.getTeamById(chosenTeam).name + ' asignado a ' + uq.getUserById(requester).user, 5000, 'rounded');
              })
              .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido asignar el equipo', 5000, 'rounded');
              });
    }else{
        Materialize.toast('No hay equipos para asignar', 5000, 'rounded');
    }
  }

  uq.discardPlayer = function(player)
  {
    if(confirm('¿Seguro?'))
    {
        $http.post("SWCDataRequesting.php", { type: "disPla", player: player, market: MARKET_EDITION})
              .success(function(data) {
                uq.teamPlayers = [];
                uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                Materialize.toast(uq.getPlayerById(player).name + ' ahora es libre', 5000, 'rounded');
              })
              .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido descartar el jugador', 5000, 'rounded');
              });
    }
  }

  uq.signWildCard = function(player, team)
  {
    if(confirm('¿Seguro?'))
    {
        $http.post("SWCDataRequesting.php", { type: "conLib", player: player, team: team, market: MARKET_EDITION})
              .success(function(data) {
                Materialize.toast(uq.getPlayerById(player).name + ' contratado', 5000, 'rounded');
                uq.redirEditar('myteam');
              })
              .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido contratar el jugador', 5000, 'rounded');
              });
    }
  }

  uq.saveSalary = function(player, newSalary)
  {
    $http.post("SWCDataRequesting.php", { type: "guaSal", player: player, salary: newSalary})
          .success(function(data) {
            Materialize.toast('Salario cambiado', 5000, 'rounded');
            uq.redirEditar('myteam');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido solicitar el equipo', 5000, 'rounded');
          });
  }

  uq.putPlayersInTable = function()
  {
    uq.teamPlayers=uq.getPlayersByTeam(uq.teamSelected);
    $('#collectPlayers').attr('ng-show', 'true');
  }

  uq.putPlayerInOffer = function()
  {
    uq.playersOffered.push(uq.getPlayerById(uq.playerSelected));
    uq.playerSelected='';
  }

  uq.quitPlayerFromOffer = function(player)
  {
    for(var i=0;i<uq.playersOffered.length;i++)
    {
      if(uq.playersOffered[i].id==player)
      {
        uq.playersOffered.splice(i, 1);
      }
    }
    if(uq.playersOffered.length==0)
    {
      $('#collectPlayers').attr('ng-show', 'false');
    }
  }

  uq.canForce = function()
  {
    var actualSignins = uq.getSigninsByMarketEdition();
    var forcedCount = 0;
    angular.forEach(actualSignins, function(value, key){
      if(value.transferType=="C")
      {
        forcedCount++;
      }
    });
    return forcedCount<CLAUSULAS;
  }

  uq.forceSign = function(player, forcerTeam)
  {
    if(uq.canForce(forcerTeam))
    {
      $http.post("SWCDataRequesting.php", { type: "claJug", oldTeam: uq.getPlayerById(player).teamID, player: player, amount: (uq.getPlayerById(player).salary*10).toFixed(), buyerTeam: forcerTeam, signinType: "C", market: MARKET_EDITION})
          .success(function(data) {
            Materialize.toast('Cláusula realizada', 5000, 'rounded');
            uq.redirEditar('myteam');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
          });
    }else{
      Materialize.toast('No te quedan cláusulas', 5000, 'rounded');
    }
  }

  uq.setOffer = function(player, offerTeam)
  {
    var availablePlayers = true;
    angular.forEach(uq.playersOffered, function(value, key){
      if(uq.isPlayerSignedYetOnThisMarket(value.id)) {
        availablePlayers = false;
        Materialize.toast(value.name + ' no se puede ofrecer porque es una incorporación', 5000, 'rounded');
      }
    });
    if(!uq.isPlayerSignedYetOnThisMarket(player) && availablePlayers)
    {
      if(uq.temporary)
      {
        $http.post("SWCDataRequesting.php", { type: "hacOfe", player: player, offerTeam: offerTeam, signinType: "T", market: MARKET_EDITION})
          .success(function(data) {
            /*if(uq.playersOffered.length!=0)
            {
              uq.offerPlayer(data.signinID);
            }*/
            Materialize.toast('Oferta de cesión realizada', 5000, 'rounded');
            uq.redirEditar('marketresume');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
          });
      }else{
        $http.post("SWCDataRequesting.php", { type: "hacOfe", player: player, amount: uq.offerRange, offerTeam: offerTeam, signinType: "F", market: MARKET_EDITION})
          .success(function(data) {
            /*if(uq.playersOffered.length!=0)
            {
              uq.offerPlayer(data.signinID);
            }*/
            Materialize.toast('Oferta realizada', 5000, 'rounded');
            uq.redirEditar('marketresume');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
          });
     }      
    }else{
      if(uq.isPlayerSignedYetOnThisMarket(player) && availablePlayers){
        Materialize.toast('El jugador ya ha sido vendido en este mercado', 5000, 'rounded');
      }
    }
  }

  uq.acceptOffer = function(signin)
  {
    if(confirm("Aceptar. ¿Seguro?"))
    {
      var offer = uq.getSigninById(signin);
      $http.post("SWCDataRequesting.php", { type: "aceOfe", player: offer.player, amount: offer.amount, newTeam: offer.buyerTeam, oldTeam: uq.getPlayerById(offer.player).teamID, id: signin})
          .success(function(data) {
            if(offer.type=='T')
            { 
              Materialize.toast(uq.getPlayerById(offer.player).name + ' ha sido cedido a ' + uq.getTeamById(offer.buyerTeam).name, 5000, 'rounded');
            }else{
              Materialize.toast(uq.getPlayerById(offer.player).name + ' ha sido transferido a ' + uq.getTeamById(offer.buyerTeam).name, 5000, 'rounded');
            }
            uq.redirEditar('marketresume');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido realizar el acuerdo', 5000, 'rounded');
          });
    }
  }

  uq.rejectOffer = function(signin)
  {
    if(confirm("Rechazar. ¿Seguro?"))
    {
      $http.post("SWCDataRequesting.php", { type: "recOfe", id: signin})
          .success(function(data) {
            Materialize.toast('Oferta rechazada', 5000, 'rounded');
            uq.redirEditar('myteam');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido rechazar la oferta', 5000, 'rounded');
          });
    }
  }
  
  uq.showDateFromCounters =function()
  {
    angular.forEach(uq.counters, function(value, key){
      if(value.counter>0)
      {
        uq.getSigninById(value.id).limitDate = uq.msToHMS(value.counter);
      }else{
        uq.getSigninById(value.id).limitDate = "CERRADA";
      }
    });
  }

  uq.msToHMS = function(ms) {
    var seconds = ms / 1000;
    var hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    var minutes = parseInt( seconds / 60 );
    seconds = seconds % 60;
    return uq.addZero(hours) + ":" + uq.addZero(minutes) + ":" + uq.addZero(seconds.toFixed());
  }

  uq.raiseAuction = function(signin, amount) {
    var dd = new Date();
    if(uq.getCounterById(signin)-dd.getTime()<=0)
    {
      $http.post("SWCDataRequesting.php", { type: "pujSub", id: signin, amount: amount, newTeam: uq.user.teamID})
          .success(function(data) {
            Materialize.toast('Puja subida a ' + (uq.getSigninById(signin).amount+amount), 5000, 'rounded');
            uq.redirEditar('myteam');
          })
          .error(function(error) {
            console.log(error);
            Materialize.toast('No se ha podido realizar la puja', 5000, 'rounded');
          });
    }else{
      Materialize.toast('La subasta está fuera de tiempo', 5000, 'rounded');
    }
    
  }

  uq.isPlayerSignedYetOnThisMarket = function(player)
  {
    var signed = false;
    angular.forEach(uq.getSigninsByMarketEdition(MARKET_EDITION), function(value,key){
      if(value.player == player)
      {
        signed = true;
      }
    });
    return signed;
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

  uq.getSigninById = function(id)
  {
    var response = {};
    angular.forEach(uq.signins, function(value, index){
        if(value.id == id)
        {
            response = value;
        }
    });
    return response;
  }

  uq.getPlayersByTeam = function(team)
  {
    var teamPlayers = [];
    angular.forEach(uq.players, function(value, index){
        if(value.teamID == team)
        {
            teamPlayers.push(value);
        }
    });
    return teamPlayers;
  }

  uq.getTotalSalariesByTeam = function(team)
  {
    var teamPlayers = uq.getPlayersByTeam(team);
    var salarios = 0;
    angular.forEach(teamPlayers, function(value, index){
        salarios += value.salary;
    });
    return salarios;
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

  uq.getMatchesByTeam = function(team)
  {
    var matches = [];
    angular.forEach(uq.matches, function(value, index){
        if(value.local == team || value.away == team)
        {
            matches.push(value);
        }
    });
    return matches;
  }

  uq.getMatchesByTournament = function(tournament)
  {
    var matches = [];
    angular.forEach(uq.matches, function(value, index){
        if(value.tournament == tournament)
        {
            matches.push(value);
        }
    });
    return matches;
  }

  uq.getUntouchablesByTeam = function(team)
  {
    var teamPlayers = uq.getPlayersByTeam(team);
    var intocables = 0;
    angular.forEach(teamPlayers, function(value, index){
        if(value.salary==10)
        {
            intocables++;
        }
    });
    return intocables;
  }

  uq.getSigninsByMarketEdition = function(market)
  {
    var transfers = [];
    angular.forEach(uq.signins, function(value, index){
        if(value.market == market)
        {
            transfers.push(value);
        }
    });
    return transfers;
  }

  uq.getPreviousSignin = function(signin)
  {
    var lastSignin = {};
    var market = -1;
    var player = uq.getSigninById(signin).player;
    angular.forEach(uq.signins, function(value,index){
      if(value.player == player && market<value.market && market<uq.getSigninById(signin).market && value.id!=signin && value.type!='T')
      {
        lastSignin = value;
        market = value.market;
      }
    });
    return lastSignin;
  }

  uq.getCounterById = function(signin)
  {
    var response = {};
    angular.forEach(uq.counters, function(value, index){
        if(value.id == signin)
        {
            response = value.counter;
        }
    });
    return response;
  }

  uq.requestTeam = function()
  {
    $http.post("SWCDataRequesting.php", { type: "solEqu", user: uq.user.id})
          .success(function(data) {
            uq.teamRequests = [];
            obtainData("RT");
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

  function setSalaryLimit()
  {
     var intoc = 0;
     var salarios = 0;
     angular.forEach(uq.teamPlayers, function(value, key){
        if(value.salary == 10)
        {
            intoc++;
        }
        salarios += value.salary;
     });
     var presupuesto = uq.getTeamById(uq.user.teamID).budget;
     if(salarios>=presupuesto || salarios>=100){
        uq.salaryLimit = 1;
     }else if(salarios>presupuesto-10 && salarios<presupuesto){
        uq.salaryLimit=(presupuesto-salarios)*10;
     }else if(salarios>90 && salarios<100){
        uq.salaryLimit=((100-salarios+uq.getPlayerById(uq.datoViajero).salary)*10).toFixed();
     }else if(salarios<presupuesto-10){
        uq.salaryLimit=100;
     }
     if(intoc>=INTOCABLES && uq.salaryLimit==100)
     {
        uq.salaryLimit--;
     }
     $('#salaryrange').attr('max', (uq.salaryLimit/10).toFixed(1));
  }

  function setOfferLimit()
  {
    uq.offerLimit = uq.getTeamById(uq.user.teamID).budget;
    $('#offerrange').attr('max', uq.offerLimit);
  }

  function userExists(user, email){
    var exists = '';
    angular.forEach(uq.users, function(value, key){
      if(value.email == email)
      {
        exists = 'email';
      }else if(value.user == user){
        exists = 'usuario';
      }
    });
    return exists;
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
                      uq.teams[v].budget = parseFloat(uq.teams[v].budget);
                    }
                    break;
                case "M":
                    uq.matches = data.matches;
                    indexFactory.matches = uq.matches;
                    for (var v = 0; v < uq.matches.length; v++) {
                      uq.matches[v].id = parseInt(uq.matches[v].id);
                      uq.matches[v].local = parseInt(uq.matches[v].local);
                      uq.matches[v].away = parseInt(uq.matches[v].away);
                      uq.matches[v].localGoals = parseInt(uq.matches[v].localGoals);
                      uq.matches[v].awayGoals = parseInt(uq.matches[v].awayGoals);
                      uq.matches[v].tournament = parseInt(uq.matches[v].tournament);
                      uq.matches[v].round = parseInt(uq.matches[v].round);
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
                      uq.players[v].teamID = parseInt(uq.players[v].teamID);
                      uq.players[v].salary = parseFloat(uq.players[v].salary);
                    }
                    if($location.path()=="/myteam")
                    {
                        uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                    }else if($location.path()=="/salary"){
                        uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                        uq.salaryLimit = setSalaryLimit();
                    }else if($location.path()=="/makeoffer"){
                        uq.offerLimit = setOfferLimit();
                        uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                    }
                    break;
                case "S":
                    uq.signins = data.signins;
                    indexFactory.signins = uq.signins;
                    for (var v = 0; v < uq.signins.length; v++) {
                      uq.signins[v].id = parseInt(uq.signins[v].id);
                      uq.signins[v].player = parseInt(uq.signins[v].player);
                      uq.signins[v].buyerTeam = parseInt(uq.signins[v].buyerTeam);
                      uq.signins[v].amount = parseFloat(uq.signins[v].amount);
                      uq.signins[v].market = parseInt(uq.signins[v].market);
                      if(uq.signins[v].accepted==1){uq.signins[v].accepted=true;}else{uq.signins[v].accepted=false;}
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
                case "CAL":
                    uq.calendar = data.calendar;
                    indexFactory.calendar = uq.calendar;
                    for (var v = 0; v < uq.calendar.length; v++) {
                      uq.calendar[v].affectedID = parseInt(uq.calendar[v].affectedID);
                      uq.calendar[v].limitDate = new Date(uq.calendar[v].limitDate);
                      var actualDate = new Date();
                      var difference = uq.calendar[v].limitDate.getTime()-actualDate.getTime();
                      if(difference>0)
                      {
                        uq.counters.push({id: uq.calendar[v].affectedID, counter:difference})
                      }
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
    var user={id:-1, user: 'axelldf6', pass: 'infinito6', email:'', valid: false, teamName: '', teamID: -1, teamImage: ''};
    var interfaz = {
        datoViajero:-1,
        getUser: function(){
            return user;
        },
        setUser: function(newUser){
          user = newUser;
        }
    }
    return interfaz;
});
