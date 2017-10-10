var appIni = angular.module('appIni', ['ngRoute']);
appIni.config(function($routeProvider) {
    $routeProvider
        .when("/", { controller: "appCtrl", controllerAs: "vm", templateUrl: "ini.html" })
        .when("/premier", { controller: "appCtrl", controllerAs: "vm", templateUrl: "premier.html" })
        .when("/cup", { controller: "appCtrl", controllerAs: "vm", templateUrl: "cup.html" })
        .when("/champions", { controller: "appCtrl", controllerAs: "vm", templateUrl: "champions.html" })
        .when("/injuriesandcards", { controller: "appCtrl", controllerAs: "vm", templateUrl: "injuriesandcards.html" })
        .when("/europaleague", { controller: "appCtrl", controllerAs: "vm", templateUrl: "europaleague.html" })
        .when("/intertoto", { controller: "appCtrl", controllerAs: "vm", templateUrl: "intertoto.html" })
        .when("/myteam", { controller: "appCtrl", controllerAs: "vm", templateUrl: "myteam.html" })
        .when("/salary", { controller: "appCtrl", controllerAs: "vm", templateUrl: "salary.html" })
        .when("/otherteams", { controller: "appCtrl", controllerAs: "vm", templateUrl: "otherteams.html" })
        .when("/makeoffer", { controller: "appCtrl", controllerAs: "vm", templateUrl: "makeoffer.html" })
        .when("/marketresume", { controller: "appCtrl", controllerAs: "vm", templateUrl: "marketresume.html" })
        .when("/wildcards", { controller: "appCtrl", controllerAs: "vm", templateUrl: "wildcards.html" })
        .when("/offers", { controller: "appCtrl", controllerAs: "vm", templateUrl: "offers.html" })
        .when("/auctions", { controller: "appCtrl", controllerAs: "vm", templateUrl: "auctions.html" })
        .when("/newauction", { controller: "appCtrl", controllerAs: "vm", templateUrl: "newauction.html" })
        .when("/europesupercup", { controller: "appCtrl", controllerAs: "vm", templateUrl: "europesupercup.html" })
        .when("/clubsupercup", { controller: "appCtrl", controllerAs: "vm", templateUrl: "clubsupercup.html" })
        .when("/pending", { controller: "appCtrl", controllerAs: "vm", templateUrl: "pending.html" })
        .when("/matchlog", { controller: "appCtrl", controllerAs: "vm", templateUrl: "matchlog.html" })
        .when("/resultinput", { controller: "appCtrl", controllerAs: "vm", templateUrl: "resultinput.html" })
        .when("/register", { controller: "appCtrl", controllerAs: "vm", templateUrl: "register.html" })
        .when("/assignteam", { controller: "appCtrl", controllerAs: "vm", templateUrl: "assignteam.html" })
        .when("/teamrequests", { controller: "appCtrl", controllerAs: "vm", templateUrl: "teamrequests.html" })
        .when("/generate", { controller: "appCtrl", controllerAs: "vm", templateUrl: "generate.html" })
        .when("/createorder", { controller: "appCtrl", controllerAs: "vm", templateUrl: "createorder.html" })
        .when("/setmyteam", { controller: "appCtrl", controllerAs: "vm", templateUrl: "setmyteam.html" })
        .when("/sponsors", { controller: "appCtrl", controllerAs: "vm", templateUrl: "sponsors.html" })
        .when("/validatesalaries", { controller: "appCtrl", controllerAs: "vm", templateUrl: "validatesalaries.html" });
});
appIni.controller("navCtrl", function($location) {
    var map = this;
    map.estoy = function(ruta) {
        return $location.path() == ruta;
    }
});
appIni.controller("appCtrl", function(indexFactory, $http, $location, $timeout) {
    var uq = this;
    uq.constants = [];
    obtainData("CONSTANTS");
    uq.datoViajero = indexFactory.datoViajero;
    uq.positions = indexFactory.getPositions();
    uq.competitions = indexFactory.getTournaments();
    uq.user = indexFactory.getUser();
    uq.teamPlayers = [];
    uq.salaryLimit = 0;
    uq.salaryRange = 0;
    uq.offerLimit = 0;
    uq.offerRange = 0;
    uq.teamSelected = '';
    uq.playerSelected = '';
    uq.tournamentSelected = '';
    uq.playersOffered = [];
    uq.teamsOnCompetition = [];
    uq.showMarket = true;
    uq.counters = [];
    uq.temporary = false;
    uq.disableInputButton = false;
	uq.resultInput={local:{type:'L', result:0, actions:[]},away:{type:'A', result:0, actions:[]}};
    uq.newAuctionObj = { name: "", overallRange: 40, positionSelected: "" };
    /*$http.post("cronjobs.php", {})
                .success(function(data) {})
                .error(function(error) {
                  console.log(error);
                  Materialize.toast('Mal', 5000, 'rounded');
                });*/
    //insertNewPlayer(indexFactory.getNewPlayers());
    //insertNewMatches();
    obtainData("T");
    switch ($location.path()) {
        case "/":
            obtainData("U");
            obtainData("M");
            obtainData("ST");
            obtainData("TO");
            break;
        case "/auctions":
            obtainData("P");
            obtainData("S");
            obtainData("CAL");
            uq.onTimeout = function() {
                angular.forEach(uq.counters, function(value, key) {
                    value.counter -= 1000;
                });
                uq.showDateFromCounters();
                uq.mytimeout = $timeout(uq.onTimeout, 1000);
            }
            uq.mytimeout = $timeout(uq.onTimeout, 1000);
            break;
        case "/createorder":
            obtainData("U");
            obtainData("ORDER");
            obtainData("RT");
            break;
        case "/cup":
            obtainData("A");
            obtainData("T");
            obtainData("TO");
            obtainData("M");
            obtainData("P");
            //setBrackets('cup');
            break;
        case "/sponsors":
            obtainData("U");
            obtainData("SPO");
            break;
        case "/europesupercup":
            obtainData("M");
            obtainData("TO");
            obtainData("T");
            obtainData("A");
            obtainData("P");
            break;
        case "/generate":
            obtainData("TO");
            obtainData("U");
            break;
        case "/makeoffer":
            obtainData("P");
            break;
        case "/marketresume":
            obtainData("P");
            obtainData("S");
            obtainData("PCS");
            break;
        case "/matchlog":
            obtainData("M");
            obtainData("A");
            obtainData("TO");
            obtainData("P");
            break;
        case "/myteam":
            obtainData("U");
            obtainData("P");
            break;
        case "/newauction":
            obtainData("P");
            obtainData("CAL");
            break;
        case "/offers":
            obtainData("P");
            obtainData("S");
            obtainData("PCS");
            break;
        case "/otherteams":
            obtainData("U");
            obtainData("P");
            break;
        case "/pending":
            obtainData("TO");
            obtainData("M");
            break;
        case "/premier":
            obtainData("A");
            obtainData("T");
            obtainData("TO");
            obtainData("M");
            obtainData("ST");
            obtainData("P");
            break;
        case "/register":
            obtainData("U");
            break;
        case "/resultinput":
            obtainData("P");
            obtainData("M");
            obtainData("TO");
            break;
        case "/salary":
            obtainData("P");
            break;
        case "/setmyteam":
            obtainData("U");
            obtainData("ORDER");
            break;
        case "/teamrequests":
            obtainData("U");
            obtainData("RT");
            break;
        case "/validatesalaries":
            obtainData("U");
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

    uq.login = function() {
        angular.forEach(uq.users, function(value, key) {
            if (value.user == uq.user.user) {
                if (value.pass == uq.user.pass) {
                    uq.user.id = value.id;
                    uq.user.email = value.email;
                    uq.user.valid = true;
                    uq.user.teamID = value.teamID;
                    uq.user.teamName = uq.getTeamById(value.id);
                }
            }
        });
        if (!uq.user.valid) {
            uq.user.user = '';
            uq.user.pass = '';
            Materialize.toast('Usuario o contraseña inválida', 5000, 'rounded');
            uq.log('Intento de login no válido');
        } else {
            indexFactory.setUser(uq.user);
            uq.log('Sesión iniciada');
        }
        return uq.user.valido;
    }

    uq.logoff = function() {
        uq.log('Desconectado');
        uq.user.id = -1;
        uq.user.email = '';
        uq.user.valid = false;
        uq.user.teamID = -1;
        uq.user.teamName = '';
        indexFactory.setUser(uq.user);
    }

    uq.register = function() {
        if (uq.user.pass.length >= 8) {
            if (uq.user.pass == uq.user2) {
                var response = userExists(uq.user.user, uq.user.email);
                if (response == '') {
                    $http.post("SWCDataRequesting.php", { type: "regUsu", user: uq.user.user, pass: uq.user.pass, email: uq.user.email })
                        .success(function(data) {
                            uq.users = [];
                            obtainData("U");
                            Materialize.toast(uq.user.user + ', has sido registrado', 5000, 'rounded');
                            location.href = "#/";
                            uq.log('Registro exitoso para ' + uq.user.email);
                            uq.login();
                        })
                        .error(function(error) {
                            console.log(error);
                            Materialize.toast('No se ha podido registrar el usuario', 5000, 'rounded');
                            uq.log('Error de registro para ' + uq.user.email);
                        });
                } else {
                    Materialize.toast('El ' + response + ' ya existe', 5000, 'rounded');
                }
            } else {
                Materialize.toast('Las contraseñas no coinciden', 5000, 'rounded');
            }
        } else {
            Materialize.toast('La contraseña debe contener 8 caracteres', 5000, 'rounded');
        }
    }

    uq.redirEditar = function(ruta) {
        location.href = "#/" + ruta;
    }

    uq.redirEditarConDatos = function(ruta, dato) {
        indexFactory.datoViajero = dato;
        uq.redirEditar(ruta);
    }

    uq.addZero = function(number) {
        if (number < 10) { number = "0" + number; }
        return number;
    }

    uq.includeTeamOnTournament = function(team, action) {
        if (action && uq.teamsOnCompetition.indexOf(team) == -1) {
            uq.teamsOnCompetition.push(team);
        } else if (!action && uq.teamsOnCompetition.indexOf(team) != -1) {
            uq.teamsOnCompetition.splice(uq.teamsOnCompetition.indexOf(team), 1);
        }
    }
	
	uq.signSponsor = function(sponsor)
	{
		if(!uq.hasSponsor(uq.user.teamID))
        {
            $http.post("SWCDataRequesting.php", { type: "sigSpo", team: uq.user.teamID, sponsor: sponsor })
                .success(function(data) {
                    var move =0;
                    switch(sponsor){
                        case 1:
                            move = 5;
                            break;
                        case 2:
                            move = 10;
                            break;
                        case 3:
                            move = 15;
                            break;
                    }
                    $http.post("SWCDataRequesting.php", { type: "chaSal", id: uq.user.teamID, amount: move })
                        .success(function(data) {
                            Materialize.toast('Sponsor elegido', 5000, 'rounded');
                            uq.log(uq.getTeamById(uq.user.teamID).name + ' elige sponsor: ' + sponsor);
                            uq.redirEditar('');
                        })
                        .error(function(error) {
                            console.log(error);
                            Materialize.toast('No se ha podido asignar el sponsor', 5000, 'rounded');
                            uq.log('No se ha podido asignar el sponsor');
                        });
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido asignar el sponsor', 5000, 'rounded');
                    uq.log('No se ha podido asignar el sponsor');
                });
        }else{
            Materialize.toast('Ya has firmado un sponsor', 5000, 'rounded');
        }
	}

    uq.hasSponsor = function(team)
    {
        var isHere = false;
        angular.forEach(uq.sponsors, function(value, key){
            if(value.team == team)
            {
                isHere = true;
            }
        });
        return isHere;
    }

    uq.giveTeamToRequester = function(requester) {
        if (setAvailableTeams().length != 0) {
            var chosenTeam = 1 + Math.floor(Math.random() * setAvailableTeams().length);
            $http.post("SWCDataRequesting.php", { type: "givTea", user: requester, team: chosenTeam })
                .success(function(data) {
                    uq.teamRequests = [];
                    obtainData("RT");
                    Materialize.toast(uq.getTeamById(chosenTeam).name + ' asignado a ' + uq.getUserById(requester).user, 5000, 'rounded');
                    uq.log(uq.getTeamById(chosenTeam).name + ' (ID '+ chosenTeam +') asignado a '+ uq.getUserById(requester).user +' (ID' + requester + ')');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido asignar el equipo', 5000, 'rounded');
                    uq.log('No se ha podido asignar el equipo');
                });
        } else {
            Materialize.toast('No hay equipos para asignar', 5000, 'rounded');
        }
    }

    uq.discardPlayer = function(player) {
        if (confirm('¿Seguro?')) {
            $http.post("SWCDataRequesting.php", { type: "disPla", player: player, market: uq.constants[0].marketEdition })
                .success(function(data) {
                    uq.teamPlayers = [];
                    uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                    angular.forEach(uq.teamPlayers, function(value, key) {
                        if (value.id == player) {
                            uq.teamPlayers.splice(key, 1);
                        }
                    });
                    Materialize.toast(uq.getPlayerById(player).name + ' ahora es libre', 5000, 'rounded');
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') liberado');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido descartar el jugador', 5000, 'rounded');
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error de liberacion');
                });
        }
    }

    uq.signWildCard = function(player, team) {
        if (confirm('¿Seguro?')) {
            $http.post("SWCDataRequesting.php", { type: "conLib", player: player, team: team, market: uq.constants[0].marketEdition })
                .success(function(data) {
                    Materialize.toast(uq.getPlayerById(player).name + ' contratado', 5000, 'rounded');
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') contratado como descarte para '+ uq.getTeamById(team).name + '(ID '+team+')');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido contratar el jugador', 5000, 'rounded');
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error de contratacion como descarte para '+ uq.getTeamById(team).name + '(ID '+team+')');
                });
        }
    }

    uq.saveSalary = function(player, newSalary) {
        $http.post("SWCDataRequesting.php", { type: "guaSal", player: player, salary: newSalary })
            .success(function(data) {
                Materialize.toast('Salario cambiado', 5000, 'rounded');
                uq.log(uq.getPlayerById(player).name + '(ID '+ player +') salario cambiado a '+ newSalary);
                uq.redirEditar('myteam');
            })
            .error(function(error) {
                console.log(error);
                uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error de cambio de salario');
                Materialize.toast('No se ha podido cambiar el salario', 5000, 'rounded');
            });
    }

    uq.putPlayersInTable = function() {
        uq.teamPlayers = uq.getPlayersByTeam(uq.teamSelected);
        $('#collectPlayers').attr('ng-show', 'true');
    }

    uq.putPlayerInOffer = function() {
        uq.playersOffered.push(uq.getPlayerById(uq.playerSelected));
        uq.playerSelected = '';
    }

    uq.quitPlayerFromOffer = function(player) {
        for (var i = 0; i < uq.playersOffered.length; i++) {
            if (uq.playersOffered[i].id == player) {
                uq.playersOffered.splice(i, 1);
            }
        }
        if (uq.playersOffered.length == 0) {
            $('#collectPlayers').attr('ng-show', 'false');
        }
    }

    function insertNewPlayer(newPlayers) {
        if(newPlayers.length!=0)
        {
            var niuPla = newPlayers.shift();
            $http.post("SWCDataRequesting.php", { type: "newPla", name: niuPla.name, teamID: niuPla.teamID, position: niuPla.position })
                .success(function(data) {
                    insertNewPlayer(newPlayers);
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido realizar el nuevo jugador', 5000, 'rounded');
                });
        }
    }

    uq.canForce = function() {
        var actualSignins = uq.getSigninsByMarketEdition(1);
        var forcedCount = 0;
		var itForced = 0;
        angular.forEach(actualSignins, function(value, key) {
            if (value.transferType == "C" && value.buyerTeam == uq.user.teamID) {
                forcedCount++;
            }else if (value.transferType == "C" && value.buyerTeam == uq.teamSelected) {
                itForced++;
            }
        });
        if(forcedCount < 3 && itForced < 3)
		{
			return true;
		}else{
			return false;
		}
    }

    uq.forceSign = function(player, forcerTeam) {
        if (uq.canForce(forcerTeam)) {
            $http.post("SWCDataRequesting.php", { type: "claJug", oldTeam: uq.getPlayerById(player).teamID, player: player, amount: (uq.getPlayerById(player).salary * 10).toFixed(), buyerTeam: forcerTeam, signinType: "C", market: uq.constants[0].marketEdition })
                .success(function(data) {
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') cambia por cláusula de '+uq.getTeamById(uq.getPlayerById(player).teamID).name+' (ID '+uq.getPlayerById(player).teamID+') a '+ uq.getTeamById(forcerTeam).name +' (ID ' + forcerTeam + ')');
                    Materialize.toast('Cláusula realizada', 5000, 'rounded');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error de cláusula a equipo ' + uq.getTeamById(forcerTeam).name + ' (ID ' + forcerTeam + ')');
                    Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
                });
        } else {
            Materialize.toast('Sin cláusulas', 5000, 'rounded');
        }
    }

    uq.setOffer = function(player, offerTeam) {
        var availablePlayers = true;
        angular.forEach(uq.playersOffered, function(value, key) {
            if (uq.isPlayerSignedYetOnThisMarket(value.id)) {
                availablePlayers = false;
                Materialize.toast(value.name + ' no se puede ofrecer porque es una incorporación', 5000, 'rounded');
            }
        });
        if (!uq.isPlayerSignedYetOnThisMarket(player) && availablePlayers) {
            if (uq.temporary) {
                $http.post("SWCDataRequesting.php", { type: "hacOfe", player: player, offerTeam: offerTeam, signinType: "T", market: uq.constants[0].marketEdition })
                    .success(function(data) {
                        if (uq.playersOffered.length != 0) {
                            uq.offerPlayer(parseInt(data.signinID), 0, uq.getPlayerById(player).teamID);
                        }
                        uq.log(uq.getPlayerById(player).name + '(ID '+ player +') oferta cesión de '+uq.getTeamById(uq.getPlayerById(player).teamID).name+' (ID '+uq.getPlayerById(player).teamID+') a '+ uq.getTeamById(offerTeam).name+' (ID '+ offerTeam +')');
                        Materialize.toast('Oferta de cesión realizada', 5000, 'rounded');
                        uq.redirEditar('marketresume');
                    })
                    .error(function(error) {
                        console.log(error);
                        uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error oferta cesión');
                        Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
                    });
            } else {
                $http.post("SWCDataRequesting.php", { type: "hacOfe", player: player, amount: uq.offerRange, offerTeam: offerTeam, signinType: "F", market: uq.constants[0].marketEdition })
                    .success(function(data) {
                        if (uq.playersOffered.length != 0) {
                            uq.offerPlayer(parseInt(data.signinID), 0, uq.getPlayerById(player).teamID);
                        }
                        uq.log(uq.getPlayerById(player).name + '(ID '+ player +') oferta traspaso de '+ uq.getTeamById(uq.getPlayerById(player).teamID).name+' (ID '+uq.getPlayerById(player).teamID+') a '+ uq.getTeamById(offerTeam).name+' (ID '+ offerTeam +')');
                        Materialize.toast('Oferta realizada', 5000, 'rounded');
                        uq.redirEditar('marketresume');
                    })
                    .error(function(error) {
                        console.log(error);
                        uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error oferta traspaso');
                        Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
                    });
            }
        } else {
            if (uq.isPlayerSignedYetOnThisMarket(player) && availablePlayers) {
                Materialize.toast('El jugador ya ha sido vendido en este mercado', 5000, 'rounded');
            }
        }
    }

    uq.offerPlayer = function(signin, cont, playerTeam) {
        if (cont < uq.playersOffered.length) {
            $http.post("SWCDataRequesting.php", { type: "ofeJug", signin: signin, player: uq.playersOffered[cont].id, offerTeam: playerTeam, originTeam: uq.user.teamID })
                .success(function(data) {
                    cont++;
                    uq.log(uq.getPlayerById(uq.playersOffered[cont].id).name + '(ID '+ uq.playersOffered[cont].id +') ofrecimiento por oferta ID ' + signin);
                    uq.offerPlayer(signin, cont, playerTeam);
                })
                .error(function(error) {
                    console.log(error);
                    uq.log(uq.getPlayerById(player).name + '(ID '+ player +') error ofrecimiento a otro equipo');
                    Materialize.toast('No se ha podido ofrecer el jugador', 5000, 'rounded');
                });
        }
    }

    uq.acceptOffer = function(signin) {
        if (confirm("Aceptar. ¿Seguro?")) {
            var offer = uq.getSigninById(signin);
            $http.post("SWCDataRequesting.php", { type: "aceOfe", player: offer.player, amount: offer.amount, newTeam: offer.buyerTeam, oldTeam: uq.getPlayerById(offer.player).teamID, id: signin })
                .success(function(data) {
                    uq.changePlayersOffered(signin);
                    if (offer.type == 'T') {
                        Materialize.toast(uq.getPlayerById(offer.player).name + ' ha sido cedido a ' + uq.getTeamById(offer.buyerTeam).name, 5000, 'rounded');
                    } else {
                        Materialize.toast(uq.getPlayerById(offer.player).name + ' ha sido transferido a ' + uq.getTeamById(offer.buyerTeam).name, 5000, 'rounded');
                    }
                    uq.log('Oferta aceptada ID ' + signin);
                    uq.redirEditar('marketresume');
                })
                .error(function(error) {
                    console.log(error);
                    uq.log('Error aceptar oferta ID ' + signin);
                    Materialize.toast('No se ha podido realizar el acuerdo', 5000, 'rounded');
                });
        }
    }

    uq.changePlayersOffered = function(signin) {
        var playersToChange = [];
        angular.forEach(uq.playerChangeSignins, function(value, index) {
            if (value.signinID == signin) {
                playersToChange.push(value);
            }
        });
        uq.transferOfferedPlayer(playersToChange, 0);
    }

    uq.transferOfferedPlayer = function(playersToChange, cont) {
        if (cont < playersToChange.length) {
            $http.post("SWCDataRequesting.php", { type: "traJug", player: playersToChange.player, newTeam: playersToChange.newTeam })
                .success(function(data) {
                    cont++;
                    uq.log('Jugador ofrecido '+ uq.getPlayerById(playersToChange.player).name +' (ID '+ playersToChange.player +') traspasado a ' + uq.getTeamById(playersToChange.newTeam).name + ' (ID ' + playersToChange.newTeam + ')');
                    uq.transferOfferedPlayer(playersToChange, cont);
                })
                .error(function(error) {
                    console.log(error);
                    uq.log('Error transferir jugador ofrecido ID ' + playersToChange.player);
                    Materialize.toast('No se ha podido transferir el jugador', 5000, 'rounded');
                });
        }
    }

    uq.rejectOffer = function(signin) {
        if (confirm("Rechazar. ¿Seguro?")) {
            $http.post("SWCDataRequesting.php", { type: "recOfe", id: signin })
                .success(function(data) {
                    uq.log('Oferta rechazada ID ' + signin);
                    Materialize.toast('Oferta rechazada', 5000, 'rounded');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    uq.log('Error rechazar oferta ID ' + signin);
                    Materialize.toast('No se ha podido rechazar la oferta', 5000, 'rounded');
                });
        }
    }

    uq.showDateFromCounters = function() {
        angular.forEach(uq.counters, function(value, key) {
            if (value.counter > 0) {
                uq.getSigninById(value.id).limitDate = uq.msToHMS(value.counter);
            } else {
                uq.getSigninById(value.id).limitDate = "CERRADA";
            }
        });
    }

    uq.msToHMS = function(ms) {
        var seconds = ms / 1000;
        var hours = parseInt(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = parseInt(seconds / 60);
        seconds = seconds % 60;
        return uq.addZero(hours) + ":" + uq.addZero(minutes) + ":" + uq.addZero(seconds.toFixed());
    }

    uq.addAuction = function() {
        var amount = 0.1;
        var average = uq.newAuctionObj.overallRange;
        if (average < 70) {
            amount = 2;
        } else if (average < 76 && average >= 70) {
            amount = 3;
        } else if (average < 81 && average >= 76) {
            amount = 5;
        } else if (average < 86 && average >= 81) {
            amount = 10;
        } else if (average > 85) { amount = 15; }
        $http.post("SWCDataRequesting.php", { type: "nueSub", playerName: uq.newAuctionObj.name, buyerTeam: uq.user.teamID, position: uq.newAuctionObj.positionSelected, amount: amount, market: uq.constants[0].marketEdition })
            .success(function(data) {
                uq.log('Subasta abierta por ' + uq.getTeamById(uq.user.teamID).name + 'para el jugador: ' + uq.newAuctionObj.name);
                Materialize.toast('Comienza la subasta', 5000, 'rounded');
                uq.redirEditar('auctions');
            })
            .error(function(error) {
                console.log(error);
                uq.log('Subasta no abierta por ' + uq.newAuctionObj.name);
                Materialize.toast('No se ha podido realizar la subasta', 5000, 'rounded');
            });
    }

    uq.raiseAuction = function(signin, amount) {
        var dd = new Date();
        if (uq.getCounterById(signin) - dd.getTime() <= 0) {
            $http.post("SWCDataRequesting.php", { type: "pujSub", id: signin, amount: amount, newTeam: uq.user.teamID })
                .success(function(data) {
                    uq.log('Puja subida a ' + (uq.getSigninById(signin).amount + amount) + ' por ' + uq.getTeamById(uq.user.teamID).name + ' para el jugador: ' + uq.getPlayerById(uq.getSigninById(signin).player).name);
                    Materialize.toast('Puja subida a ' + (uq.getSigninById(signin).amount + amount), 5000, 'rounded');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    uq.log('No se ha podido subir la puja: ' + uq.getTeamById(uq.user.teamID).name + " - " + uq.getPlayerById(uq.getSigninById(signin).player).name);
                    Materialize.toast('No se ha podido realizar la puja', 5000, 'rounded');
                });
        } else {
            Materialize.toast('La subasta está fuera de tiempo', 5000, 'rounded');
        }
    }

    uq.equalSalaries = function(team)
    {
        var playersOfTheTeam = uq.getPlayersByTeam(team);
        angular.forEach(playersOfTheTeam, function(value, key){
            uq.saveSalary(value.id, (100/playersOfTheTeam.length).toFixed(1));
        });
    }

    uq.countSalaries = function(team, positive) {
        var amount = 0;
        if (positive) {
            amount = 0 + (uq.getTotalSalariesByTeam(team));
        } else {
            amount = 0 - (uq.getTotalSalariesByTeam(team));
        }
        $http.post("SWCDataRequesting.php", { type: "chaSal", id: team, amount: amount })
            .success(function(data) {
                uq.log('Salarios cambiados para ' + uq.getTeamById(team).name + ' (ID ' + team + ')');
                Materialize.toast('Reintroducido el importe de salarios de ' + uq.getTeamById(team).name, 5000, 'rounded');
            })
            .error(function(error) {
                console.log(error);
                uq.log('Error cambio de salarios para ' + uq.getTeamById(team).name + ' (ID ' + team + ')');
                Materialize.toast('No se han podido reasignar salarios', 5000, 'rounded');
            });
    }

    uq.changeLocalAway = function(array) {
        var aux = [];
        for (var i = 0; i < array.length; i++) {
            aux.push([array[i][1], array[i][0]]);
        }
        return aux;
    }

    function insertNewMatches(){
        var newMatches = indexFactory.getNewMatches();
        var cont = 1;
        while(newMatches.length!=0)
        {
            var newRound = newMatches.shift();
            if(cont%2==0)
            {
                newRound = changeLocalAway(newRound);
            }
            insertMatches(newRound, 0, cont, 1);
            cont++;
        }
    }

    uq.insertMatches = function(matches, counter, round, tournament) {
        if (counter < matches.length) {
            if (matches[counter][0] != -1 && matches[counter][1] != -1) {

                $http.post("SWCDataRequesting.php", { type: "insMat", local: matches[counter][0], away: matches[counter][1], tournament: tournament, round: round })
                    .success(function(data) {
                        uq.insertMatches(matches, counter + 1, round, tournament);
                    })
                    .error(function(error) {
                        console.log(error);
                        uq.log('Error insertando partidos de torneo ' + uq.getTournamentById(tournament).name + ' - Edicion ' + uq.getTournamentById(tournament).edition);
                        Materialize.toast('No se han podido insertar partidos', 5000, 'rounded');
                    });
            } else {
                uq.insertMatches(matches, counter + 1, round, tournament);
            }
        }
    }

    uq.getNewEditionOf = function(tournament) {
        var edition = -1;
        for (var i = 0; i < uq.tournaments.length; i++) {
            if (uq.tournaments[i].name == tournament) {
                edition = uq.tournaments[i].edition + 1;
            }
        }
        if (edition == -1) {
            return 1;
        } else {
            return edition;
        }
    }

    uq.generate = function() {
        if (uq.teamsOnCompetition.length > 2) {
            $http.post("SWCDataRequesting.php", { type: "insTou", name: uq.tournamentSelected, edition: uq.getNewEditionOf(uq.tournamentSelected) })
                .success(function(data) {
                            var headGroup = [];
                            if(uq.tournamentSelected=='Champions League')
                            {
                                headGroup.push(uq.teamsOnCompetition.shift());
                                headGroup.push(uq.teamsOnCompetition.shift());
                                headGroup.push(uq.teamsOnCompetition.shift());
                                headGroup.push(uq.teamsOnCompetition.shift());
                            }
                            let counter = uq.teamsOnCompetition.length;
                            while (counter > 0) {
                                let index = Math.floor(Math.random() * counter);
                                counter--;
                                let temp = uq.teamsOnCompetition[counter];
                                uq.teamsOnCompetition[counter] = uq.teamsOnCompetition[index];
                                uq.teamsOnCompetition[index] = temp;
                            }
                            if(uq.tournamentSelected=='Champions League')
                            {
                                uq.teamsOnCompetition.unshift(headGroup[0]);
                                uq.teamsOnCompetition.splice(4, 0, headGroup[1]);
                                uq.teamsOnCompetition.splice(8, 0, headGroup[2]);
                                uq.teamsOnCompetition.splice(12, 0, headGroup[3]);
                            }
                    switch (uq.tournamentSelected) {
                        case "Primera":
                        case "Segunda":
                            var rounds = 0;
                            var matches = [];
                            var net = [];
                            //  id  local   away  tournament  round   local_goals   away_goals  limit_date 
                            for (var i = 0; i < uq.teamsOnCompetition.length; i++) {
                                if (i < uq.teamsOnCompetition.length - 1) {
                                    net.push([uq.teamsOnCompetition[i], uq.teamsOnCompetition[i + 1]]);
                                    i++;
                                } else {
                                    net.push([uq.teamsOnCompetition[uq.teamsOnCompetition.length - 1], -1]);
                                }
                            }
                            if (uq.teamsOnCompetition.length % 2 != 0) {
                                uq.teamsOnCompetition.push(-1);
                            }
                            rounds = (uq.teamsOnCompetition.length - 1);
                            for (var u = 1; u <= rounds; u++) {
                                var aux = -34;
                                var aux2 = -34;
                                for (var k = 0; k < net.length; k++) {
                                    if (k == 0) {
                                        aux = net[1][0];
                                        net[1][0] = net[0][1];
                                        net[0][1] = net[1][1];
                                    } else if (k == 1 && net.length != 2) {
                                        aux2 = aux;
                                        aux = net[2][0];
                                        net[2][0] = aux2;
                                        net[1][1] = net[2][1];
                                    } else if (k == 1 && net.length == 2) {
                                        net[1][1] = aux;
                                    } else if (k == net.length - 1) {
                                        net[k][1] = net[k][0];
                                        net[k][0] = aux;
                                    } else {
                                        aux2 = aux;
                                        aux = net[k][0];
                                        net[k][0] = aux2;
                                        net[k][1] = net[k + 1][1];
                                    }
                                }
                                if (net.length >= 4) {
                                    aux = net[2][0];
                                    net[2][0] = net[3][0];
                                    net[3][0] = aux;
                                }
                                net = uq.changeLocalAway(net);
                                uq.insertMatches(net, 0, u, data.id);
                                uq.insertMatches(uq.changeLocalAway(net), 0, u + rounds, data.id);
                            }
                            break;
                        case "Copa":
                        case "Europa League":
                        case "Intertoto":
                            var knownBrackets = [2, 4, 8, 16, 32];
                            var bracketCount = 0;
                            var base = uq.teamsOnCompetition.length;
                            var closest = _.find(knownBrackets, function(k) { return k >= base; });
                            if (base <= _.last(knownBrackets)) {
                                var byes = closest - base;
                            }
                            if (byes > 0) { base = closest; }
                            var brackets = [],
                                round = 1,
                                baseT = base / 2,
                                baseC = base / 2,
                                teamMark = 0,
                                nextInc = base / 2;
                            for (i = 1; i <= (base - 1); i++) {
                                var baseR = i / baseT,
                                    isBye = false;

                                if (byes > 0 && (i % 2 != 0 || byes >= (baseT - i))) {
                                    isBye = true;
                                    byes--;
                                }

                                var last = _.map(_.filter(brackets, function(b) { return b.nextGame == i; }), function(b) { return { game: b.bracketNo, teams: b.teamnames }; });

                                brackets.push({
                                    lastGames: round == 1 ? null : [last[0].game, last[1].game],
                                    nextGame: nextInc + i > base - 1 ? null : nextInc + i,
                                    teamnames: round == 1 ? [uq.teamsOnCompetition[teamMark], uq.teamsOnCompetition[teamMark + 1]] : [0, 0],
                                    bracketNo: i,
                                    round: round,
                                    bye: isBye
                                });
                                teamMark += 2;
                                if (i % 2 != 0) nextInc--;
                                while (baseR >= 1) {
                                    round++;
                                    baseC /= 2;
                                    baseT = baseT + baseC;
                                    baseR = i / baseT;
                                }
                            }
                            var toEnterIda = [];
                            var toEnterVuelta = [];
                            angular.forEach(brackets, function(value,key){
                                if(value.round==1)
                                {
                                    //  id  local   away  tournament  round   local_goals   away_goals  limit_date 
                                    toEnterIda.push([value.teamnames[0],value.teamnames[1]]);
                                    toEnterVuelta.push([value.teamnames[1],value.teamnames[0]]);
                                }else{
                                    console.log('MATCH '+value.bracketNo+ ': INSERT INTO matches (local,away,tournament,round) values (Game '+value.lastGames[0]+' Winner, Game '+value.lastGames[1]+' Winner, '+data.id+', '+value.round+')');
                                    console.log('MATCH '+value.bracketNo+ ': INSERT INTO matches (local,away,tournament,round) values (Game '+value.lastGames[1]+' Winner, Game '+value.lastGames[0]+' Winner, '+data.id+', '+value.round+')');
                                }
                            });
                            uq.insertMatches(toEnterIda, 0, 1, data.id);
                            uq.insertMatches(toEnterVuelta, 0, 2, data.id);
                            break;
                        case "Champions League":
                            
                            break;
                        case "Supercopa Europea":
                        case "Supercopa Clubes":
                            uq.insertMatches([[uq.teamsOnCompetition[0], uq.teamsOnCompetition[1]]], 0, 1, data.id);
                            break;
                    }
                })
                .error(function(error) {
                    console.log(error);
                    uq.log('Error generacion de torneo');
                    Materialize.toast('No se ha podido generar el torneo', 5000, 'rounded');
                });
        } else {
            Materialize.toast('No hay mínimo dos equipos en liza', 5000, 'rounded');
        }
    }
	
    uq.generateOrder = function(cont)
    {
        if(uq.teamsOnCompetition.length!=0)
        {
            var ran = uq.teamsOnCompetition.splice(Math.floor(Math.random()*uq.teamsOnCompetition.length), 1);
            $http.post("SWCDataRequesting.php", { type: "genOrd", user: ran[0], position: cont })
                    .success(function(data) {
                        uq.generateOrder(cont+1);
                    })
                    .error(function(error) {
                        console.log(error);
                        Materialize.toast('No se ha podido generar el orden', 5000, 'rounded');
                    });
        }else{
            uq.setActualPosition(1);
            uq.redirEditar('');
        }
    }

    uq.setMyTeam = function()
    {
        if(uq.newTeam != '')
        {
            $http.post("SWCDataRequesting.php", { type: "setOrd", user: uq.user.teamID, team: uq.newTeam })
                .success(function(data) {
                    uq.teamRequests = [];
                    obtainData("RT");
                    uq.setActualPosition(uq.constants.actualPosition+1);
                    uq.redirEditar('');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido asignar el equipo', 5000, 'rounded');
                    uq.log('No se ha podido asignar el equipo');
                });
        }else{
            Materialize.toast('Rellena el campo', 5000, 'rounded');
        }
    }

    uq.setActualPosition = function(position)
    {
        while(uq.teamsOnCompetition.length!=0)
        {
            $http.post("SWCDataRequesting.php", { type: "actPos", position: position })
                    .success(function(data) {
                    })
                    .error(function(error) {
                        console.log(error);
                        Materialize.toast('No se ha podido actualizar la posicion', 5000, 'rounded');
                    });
        }
    }

	uq.addAction = function(team, type)
	{
		var newAction = {type: type, player:{}};
		if(team.type=='L')
		{
			switch(type)
			{
				case 'G':
					newAction.player = parseInt(uq.resultInput.local.goals);
					uq.resultInput.local.goals='';
                    uq.resultInput.local.result++;
					break;
				case 'A':
					newAction.player = parseInt(uq.resultInput.local.assists);
					uq.resultInput.local.assists='';
					break;
				case 'Y':
					newAction.player = parseInt(uq.resultInput.local.yellowCards);
					uq.resultInput.local.yellowCards='';
					break;
				case 'R':
					newAction.player = parseInt(uq.resultInput.local.redCards);
					uq.resultInput.local.redCards='';
					break;
				case 'I':
					newAction.player = parseInt(uq.resultInput.local.injuries);
					uq.resultInput.local.injuries='';
					break;
				case 'M':
					newAction.player = parseInt(uq.resultInput.local.mvp);
					uq.resultInput.local.mvp='';
					break;
			}
			uq.resultInput.local.actions.push(newAction);
		}else if(team.type=='A')
		{
			switch(type)
			{
				case 'G':
					newAction.player = parseInt(uq.resultInput.away.goals);
					uq.resultInput.away.goals='';
                    uq.resultInput.away.result++;
					break;
				case 'A':
					newAction.player = parseInt(uq.resultInput.away.assists);
					uq.resultInput.away.assists='';
					break;
				case 'Y':
					newAction.player = parseInt(uq.resultInput.away.yellowCards);
					uq.resultInput.away.yellowCards='';
					break;
				case 'R':
					newAction.player = parseInt(uq.resultInput.away.redCards);
					uq.resultInput.away.redCards='';
					break;
				case 'I':
					newAction.player = parseInt(uq.resultInput.away.injuries);
					uq.resultInput.away.injuries='';
					break;
				case 'M':
					newAction.player = parseInt(uq.resultInput.away.mvp);
					uq.resultInput.away.mvp='';
					break;
			}
			uq.resultInput.away.actions.push(newAction);
		}
	}
	
	uq.removeAction = function (action, type)
	{
		if(type=='L')
		{
			for(var i=0;i<uq.resultInput.local.actions.length;i++)
			{
				if(uq.resultInput.local.actions[i].type==action.type && uq.resultInput.local.actions[i].player==action.player)
				{
                    if(action.type == 'G')
                    {
                        uq.resultInput.local.result--;
                    }
					uq.resultInput.local.actions.splice(i, 1);
				}
			}
		}else if(type=='A'){
			for(var i=0;i<uq.resultInput.away.actions.length;i++)
			{
				if(uq.resultInput.away.actions[i].type==action.type && uq.resultInput.away.actions[i].player==action.player)
				{
                    if(action.type == 'G')
                    {
                        uq.resultInput.away.result--;
                    }
					uq.resultInput.away.actions.splice(i, 1);

				}
			}
		}
	}

    uq.resolveMatch = function()
    {
        var canResolve = true;
        var goa = 0;
        var assi = 0;
        var mv = 0;
        uq.disableInputButton = true;
        angular.forEach(uq.resultInput.local.actions, function(value, key){
            if(value.type == 'A'){
                assi++;
            }else if(value.type == 'M'){
                mv++;
            }else if(value.type == 'G'){
                goa++;
            }
        });
        if(goa < assi)
        {
            Materialize.toast('Hay más asistencias que goleadores', 5000, 'rounded');
            canResolve = false;
            uq.disableInputButton = false;
        }
        goa = 0;
        assi = 0;
        angular.forEach(uq.resultInput.away.actions, function(value, key){
            if(value.type == 'A'){
                assi++;
            }else if(value.type == 'M'){
                mv++;
            }else if(value.type == 'G'){
                goa++;
            }
        });
        if(goa < assi)
        {
            Materialize.toast('Hay más asistencias que goleadores', 5000, 'rounded');
            canResolve = false;
            uq.disableInputButton = false;
        }
        if(mv > 1)
        {
            Materialize.toast('No puede haber más de un MVP', 5000, 'rounded');
            canResolve = false;
            uq.disableInputButton = false;
        }
        if(canResolve)
        {
            $http.post("SWCDataRequesting.php", { type: "setRes", matchID: uq.datoViajero, localGoals: uq.resultInput.local.result, awayGoals: uq.resultInput.away.result  })
                    .success(function(data) {
                        var actionsToPush = [];
                        angular.forEach(uq.resultInput.local.actions, function(value, key){
                            actionsToPush.push(value);
                        });
                        angular.forEach(uq.resultInput.away.actions, function(value, key){
                            actionsToPush.push(value);
                        });
                        uq.log('Partido resuelto ID ' + uq.datoViajero);
                        uq.insertAction(actionsToPush, 0);
                    })
                    .error(function(error) {
                        console.log(error);
                        uq.log('Partido no resuelto ERROR ID ' + uq.datoViajero);
                        Materialize.toast('No se ha podido insertar la acción', 5000, 'rounded');
                        uq.disableInputButton = false;
                    });
        }
        
    }

    uq.insertAction = function(actions, counter)
    {
        if (counter < actions.length){
            $http.post("SWCDataRequesting.php", { type: "insAct", matchID: uq.datoViajero, actionType: actions[counter].type, player: actions[counter].player })
                    .success(function(data) {
                        uq.insertAction(actions, counter + 1);
                    })
                    .error(function(error) {
                        console.log(error);
                        Materialize.toast('No se ha podido insertar la acción', 5000, 'rounded');
                    });
        }else{
            var localPoints = 0;
            var awayPoints = 0;
            var localWon = 0;
            var localDraw = 0;
            var localLost = 0;
            var awayWon = 0;
            var awayDraw = 0;
            var awayLost = 0;
            if(uq.resultInput.local.result>uq.resultInput.away.result) {
                localPoints = 3;
                localWon = 1;
                awayLost = 1;
            }else if(uq.resultInput.local.result<uq.resultInput.away.result){
                awayPoints = 3;
                localLost = 1;
                awayWon = 1;
            }else{
                localPoints = 1;
                awayPoints = 1;
                localDraw = 1;
                awayDraw = 1;
            }
            $http.post("SWCDataRequesting.php", { type: "updSta", tournamentID:uq.getMatchById(uq.datoViajero).tournament, team: uq.getMatchById(uq.datoViajero).local, points: localPoints, won: localWon,  draw: localDraw, lost: localLost, goalsFor: uq.resultInput.local.result, goalsAgainst: uq.resultInput.away.result})
                    .success(function(data) {
                        $http.post("SWCDataRequesting.php", { type: "updSta", tournamentID:uq.getMatchById(uq.datoViajero).tournament, team: uq.getMatchById(uq.datoViajero).away, points: awayPoints, won: awayWon,  draw: awayDraw, lost: awayLost, goalsFor: uq.resultInput.away.result, goalsAgainst: uq.resultInput.local.result})
                            .success(function(data) {
                                uq.log('Actualizado clasificacion ' + uq.datoViajero);
                                uq.redirEditar('pending');
                            })
                            .error(function(error) {
                                console.log(error);
                                uq.log('Error actualizar clasificacion ' + uq.datoViajero);
                                Materialize.toast('No se ha podido actualizar la clasificación', 5000, 'rounded');
                            });
                    })
                    .error(function(error) {
                        console.log(error);
                        uq.log('Error actualizar clasificacion ' + uq.datoViajero);
                        Materialize.toast('No se ha podido actualizar la clasificación', 5000, 'rounded');
                    });
        }
    }

    uq.getStatsByTournament = function(type, tournament)
    {
        var matchesToStudy = uq.getMatchesByTournament(tournament);
        var actionsToStudy = [];
        var ret = [];
        angular.forEach(matchesToStudy, function(value, key){
            var actionsOfTheMatch = uq.getActionsByMatch(value.id);
            angular.forEach(actionsOfTheMatch, function(value2, key2){
                if(value2.type==type) {
                    actionsToStudy.push(value2);
                }else if(type=='C' && value2.type=='Y' || value2.type=='R')
                {
                    actionsToStudy.push(value2);
                }
            });
        });
        angular.forEach(actionsToStudy, function(value3, key3){
            var playerExists = false;
            switch(type)
            {
                case 'G':
                        if(value3.type==type)
                        {
                            angular.forEach(ret, function(value4, key4) {
                                if(value4.player==value3.player)
                                {
                                    playerExists=true;
                                    value4.goals++;
                                }
                            });
                            if(!playerExists){
                                ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, goals: 1});    
                            }
                        }
                        break;
                case 'A':
                        if(value3.type==type)
                        {
                            angular.forEach(ret, function(value4, key4) {
                                if(value4.player==value3.player)
                                {
                                    playerExists=true;
                                    value4.assists++;
                                }
                            });
                            if(!playerExists){
                                ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, assists: 1});    
                            }
                        }
                        break;
                case 'M':
                        if(value3.type==type)
                        {
                            angular.forEach(ret, function(value4, key4) {
                                if(value4.player==value3.player)
                                {
                                    playerExists=true;
                                    value4.mvp++;
                                }
                            });
                            if(!playerExists){
                                ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, mvp: 1});    
                            }
                        }
                        break;
                case 'I':
                        if(value3.type==type)
                        {
                            angular.forEach(ret, function(value4, key4) {
                                if(value4.player==value3.player)
                                {
                                    playerExists=true;
                                    value4.injuries++;
                                }
                            });
                            if(!playerExists){
                                ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, injuries: 1});    
                            }
                        }
                        break;
                case 'C':
                        if(value3.type=='Y' || value3.type=='R')
                        {
                            angular.forEach(ret, function(value4, key4) {
                                if(value4.player==value3.player)
                                {
                                    playerExists=true;
                                    if(value3.type=='Y')
                                    {
                                        value4.yellowCards++;
                                    }else if(value3.type=='R')
                                    {
                                        value4.redCards++;
                                    }
                                }
                            });
                            if(!playerExists){
                                if(value3.type=='Y')
                                {
                                    ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, yellowCards: 1, redCards: 0}); 
                                }else if(value3.type=='R')
                                {
                                    ret.push({player: value3.player, team: uq.getPlayerById(value3.player).teamID, yellowCards: 0, redCards: 1}); 
                                }
                            }
                        }
                        break;
            }
        });
        if(type=='LGT')
        {
            angular.forEach(uq.standings, function(value, key){
                if(value.tournamentID==tournament)
                {
                    ret.push({team: value.team, goals: value.goalsAgainst});
                }
            });
        }else if(type=='MGT')
        {
            angular.forEach(uq.standings, function(value, key){
                if(value.tournamentID==tournament)
                {
                    ret.push({team: value.team, goals: value.goalsFor});
                }
            });
        }
        return ret;
    }

    uq.log = function(message) {
        $http.post("SWCDataRequesting.php", { type: "log", user: uq.user.id, message: message})
                            .success(function(data) {
                                console.log(message);
                            })
                            .error(function(error) {
                                console.log(error);
                            });
    }

    uq.searchTournamentForTeam = function(team)
    {
        var ret = [];
        angular.forEach(uq.standings, function(value, key){
            if(value.team == uq.user.teamID && (uq.getTournamentById(value.tournamentID).name.indexOf('Primera')!=-1 || uq.getTournamentById(value.tournamentID).name.indexOf('Segunda')!=-1))
            {
                ret.push(value.tournamentID);
            }
        });
        var highestEdition = -1;
        var editHigh = -1;
        angular.forEach(ret, function(value, key){
            if(uq.getTournamentById(value).edition > editHigh)
            {
                highestEdition = value;
                editHigh = uq.getTournamentById(highestEdition).edition
            }
        })
        return highestEdition;
    }

    uq.searchCupForTeam = function(team, cup)
    {
        var ret = [];
        angular.forEach(uq.matches, function(value, key){
            if((value.local == uq.user.teamID || value.away == uq.user.teamID) && uq.getTournamentById(value.tournament).name.indexOf(cup)!=-1)
            {
                ret.push(value.tournament);
            }
        });
        var highestEdition = -1;
        var editHigh = -1;
        angular.forEach(ret, function(value, key){
            if(uq.getTournamentById(value).edition > editHigh)
            {
                highestEdition = value;
                editHigh = uq.getTournamentById(highestEdition).edition
            }
        });
        return highestEdition;
    }

    uq.areThisTeamOut = function(team, tournament) // 0 = Playing, 1 = Out of this tournament, 2 = Not even in this tournament
    {
        var lastEdition = uq.searchCupForTeam(team, uq.getTournamentById(tournament).name);
        if (uq.getTournamentById(lastEdition).edition<uq.getTournamentById(tournament).edition)
        {
            return 2;
        }else if(uq.getTournamentById(lastEdition).edition==uq.getTournamentById(tournament).edition){
           var matches = uq.getMatchesByTournament(tournament);
           var myLastRound = -1;
           var lastRound = -1;
           angular.forEach(uq.matches, function(value, key){
            if(value.local==team || value.away==team)
            {
                myLastRound = value.round;
            }else{
                lastRound = value.round;
            }
           });
           if(myLastRound >= lastRound)
           {
            return 0;
           }else{
            return 1;
           }
        }else{
            return 0;
        }
    }

    uq.playedMatches = function(team)
    {
        return parseInt(pl.won) + parseInt(pl.draw) + parseInt(pl.lost);
    }

    uq.areSalariesValid = function(team) {
        var playersToValid = uq.getPlayersByTeam(team);
        angular.forEach(playersToValid, function(value, key) {
            if (value.salary > 10 || value.salary == 0) {
                return false;
            }
        });
        if (uq.getTotalSalariesByTeam(team) > 100) {
            return false;
        }
        return true;
    }

    uq.isPlayerSignedYetOnThisMarket = function(player) {
        var signed = false;
        angular.forEach(uq.getSigninsByMarketEdition(uq.constants[0].marketEdition), function(value, key) {
            if (value.player == player) {
                signed = true;
            }
        });
        return signed;
    }

    uq.getUserById = function(id) {
        var response = {};
        angular.forEach(uq.users, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getTeamById = function(id) {
        var response = {};
        angular.forEach(uq.teams, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getManagerOf = function(team) {
        var response = {};
        angular.forEach(uq.users, function(value, index) {
            if (value.teamID == team) {
                response = value;
            }
        });
        return response;
    }

    uq.getMatchById = function(id) {
        var response = {};
        angular.forEach(uq.matches, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getPlayerById = function(id) {
        var response = {};
        angular.forEach(uq.players, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getSigninById = function(id) {
        var response = {};
        angular.forEach(uq.signins, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getTournamentById = function(id) {
        var response = {};
        angular.forEach(uq.tournaments, function(value, index) {
            if (value.id == id) {
                response = value;
            }
        });
        return response;
    }

    uq.getPlayersByTeam = function(team) {
        var teamPlayers = [];
        angular.forEach(uq.players, function(value, index) {
            if (value.teamID == team) {
                teamPlayers.push(value);
            }
        });
        return teamPlayers;
    }

    uq.getTotalSalariesByTeam = function(team) {
        var teamPlayers = uq.getPlayersByTeam(team);
        var salarios = 0;
        angular.forEach(teamPlayers, function(value, index) {
            salarios += value.salary;
        });
        return salarios.toFixed(1);
    }

    uq.getActionsByMatch = function(matchID) {
        var matchActions = [];
        angular.forEach(uq.actions, function(value, index) {
            if (value.matchID == matchID) {
                matchActions.push(value);
            }
        });
        return matchActions;
    }

    uq.isPlayerFromThisTeam = function(player, team)
    {
        return uq.getPlayerById(player).teamID == team;
    }

    uq.isInOrder = function()
    {
        angular.forEach(uq.teamOrder, function(value,index){
            if(value.user==uq.user.teamID) {
                return true;
            }
        });
        return false;
    }

    uq.getMatchActions = function(actions, team){
        var teamMatchActions = [];
        angular.forEach(actions, function(value, index) {
            if (uq.isPlayerFromThisTeam(value.player, team)) {
                teamMatchActions.push(value);
            }
        });
        return teamMatchActions;
    }

    uq.getMatchesByTeam = function(team) {
        var matches = [];
        angular.forEach(uq.matches, function(value, index) {
            if (value.local == team || value.away == team) {
                matches.push(value);
            }
        });
        return matches;
    }

    uq.getMatchesByTournament = function(tournament) {
        var matches = [];
        angular.forEach(uq.matches, function(value, index) {
            if (value.tournament == tournament) {
                matches.push(value);
            }
        });
        return matches;
    }

    uq.getUntouchablesByTeam = function(team) {
        var teamPlayers = uq.getPlayersByTeam(team);
        var intoca = 0;
        angular.forEach(teamPlayers, function(value, index) {
            if (value.salary == 10) {
                intoca++;
            }
        });
        return intoca;
    }

    uq.getSigninsByMarketEdition = function(market) {
        var transfers = [];
        angular.forEach(uq.signins, function(value, index) {
            if (value.market == market) {
                transfers.push(value);
            }
        });
        return transfers;
    }

    uq.getPreviousSignin = function(signin) {
        var lastSignin = {};
        var market = -1;
        var player = uq.getSigninById(signin).player;
        angular.forEach(uq.signins, function(value, index) {
            if (value.player == player && market < value.market && market < uq.getSigninById(signin).market && value.id != signin && value.type != 'T') {
                lastSignin = value;
                market = value.market;
            }
        });
        return lastSignin;
    }

    uq.getCounterById = function(signin) {
        var response = {};
        angular.forEach(uq.counters, function(value, index) {
            if (value.id == signin) {
                response = value.counter;
            }
        });
        return response;
    }

    uq.requestTeam = function() {
        $http.post("SWCDataRequesting.php", { type: "solEqu", user: uq.user.id })
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

    uq.isNotBusy = function(team){
        return setAvailableTeams().indexOf(team)==-1;
    }

    uq.getInjuriesAndCardsByTournament = function(tournament)
    {
        var ret = [];
        var yellowCardsCount = [];
        angular.forEach(uq.actions, function(value, key){
            if(uq.getMatchById(value.matchID).tournament==tournament)
            {
                switch(value.type)
                {
                    case 'Y': var isHereNow = false;
                        angular.forEach(yellowCardsCount, function(value2, key2){
                            if(value2.player==value.player)
                            {
                                value2.yellowCards++;
                                isHereNow=true;
                                ret.push({rounds: uq.getMatchById(value.matchID).round + 3, type: 'Y', player: value.player});
                            }
                        });
                        if(!isHereNow) {
                            yellowCardsCount.push({player: value.player, yellowCards: 1});
                        }
                        break;
                    case 'R': ret.push({rounds: (uq.getMatchById(value.matchID).round + 3) + " y " + (uq.getMatchById(value.matchID).round + 4), type: 'R', player: value.player});
                            break;
                    case 'I': ret.push({rounds: uq.getMatchById(value.matchID).round + 3, type: 'I', player: value.player});
                            break;
                }
            }
        });
        return ret;
    }

    /*function setBrackets() {
        var singleElimination = {
          "teams": [              // Matchups
            [,], // First match
            [,]  // Second match
          ],
          "results": [            // List of brackets (single elimination, so only one bracket)
            [                     // List of rounds in bracket
              [                   // First round in this bracket
                [0, 0],           // Team 1 vs Team 2
                [0, 0]            // Team 3 vs Team 4
              ],
              [                   // Second (final) round in single elimination bracket
                [0, 0],           // Match for first place
                [0, 0]            // Match for 3rd place
              ]
            ]
          ]
        }
        $('.bracket').bracket({

          init: null, // data to initialize
          save: null, // called whenever bracket is modified
          userData: null, // custom user data
          onMatchClick: null, // callback
          onMatchHover: null, // callback
          decorator: null, // a function
          skipSecondaryFinal: false,
          skipGrandFinalComeback: false,
          skipConsolationRound: false,
          dir: 'rl', // "rl" or  "lr",
          disableToolbar: false,
          disableTeamEdit: false,
          teamWidth: '', // number
          scoreWidth: '', // number
          roundMargin: '', // number
          matchMargin: '', // number
        });
    }

    function setParticipatingTeams(tournament) {

    }*/

    function setAvailableTeams() {
        var availableTeams = [];
        angular.forEach(uq.teams, function(value, key) {
            var available = true;
            angular.forEach(uq.users, function(value2, key2) {
                if (value.id == value2.teamID) {
                    available = false;
                }
            });
            if (available) {
                availableTeams.push(value.id);
            }
        });
        return availableTeams;
    }

    function setSalaryLimit() {
        var intoc = 0;
        var salarios = 0;
        angular.forEach(uq.teamPlayers, function(value, key) {
            if (value.salary == 10) {
                intoc++;
            }
            salarios += value.salary;
        });
        var presupuesto = uq.getTeamById(uq.user.teamID).budget;
        if (salarios >= presupuesto || salarios >= 100) {
            uq.salaryLimit = 1;
        } else if (salarios > presupuesto - 10 && salarios < presupuesto) {
            uq.salaryLimit = (presupuesto - salarios) * 10;
        } else if (salarios > 90 && salarios < 100) {
            uq.salaryLimit = ((100 - salarios + uq.getPlayerById(uq.datoViajero).salary) * 10).toFixed();
        } else if (salarios < presupuesto - 10) {
            uq.salaryLimit = 100;
        }
        if (intoc >= uq.constants[0].untouchables && uq.salaryLimit == 100) {
            uq.salaryLimit--;
        }
        $('#salaryrange').attr('max', (uq.salaryLimit / 10).toFixed(1));
    }

    function setOfferLimit() {
        uq.offerLimit = uq.getTeamById(uq.user.teamID).budget;
        $('#offerrange').attr('max', uq.offerLimit);
    }

    function userExists(user, email) {
        var exists = '';
        angular.forEach(uq.users, function(value, key) {
            if (value.email == email) {
                exists = 'email';
            } else if (value.user == user) {
                exists = 'usuario';
            }
        });
        return exists;
    }

    function obtainData(dataType) {
        $http.post("SWCDataRequesting.php", { type: "recDat", dataType: dataType })
            .success(function(data) {
                switch (dataType) {
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
                            uq.matches[v].limitDate = new Date(uq.matches[v].limitDate);
                        }
                        break;
                    case "A":
                        uq.actions = data.actions;
                        indexFactory.actions = uq.actions;
                        for (var v = 0; v < uq.actions.length; v++) {
                            uq.actions[v].matchID = parseInt(uq.actions[v].matchID);
                            uq.actions[v].player = parseFloat(uq.actions[v].player);
                        }
                        break;
                    case "P":
                        uq.players = data.players;
                        indexFactory.players = uq.players;
                        for (var v = 0; v < uq.players.length; v++) {
                            uq.players[v].id = parseInt(uq.players[v].id);
                            uq.players[v].teamID = parseInt(uq.players[v].teamID);
                            uq.players[v].salary = parseFloat(uq.players[v].salary);
                        }
                        if ($location.path() == "/myteam") {
                            uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                        } else if ($location.path() == "/salary") {
                            uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                            uq.salaryLimit = setSalaryLimit();
                        } else if ($location.path() == "/makeoffer") {
                            uq.offerLimit = setOfferLimit();
                            uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                        } else if($location.path() == "/resultinput") {
                            uq.resultInput.local.players=uq.getPlayersByTeam(uq.getMatchById(uq.datoViajero).local);
                            uq.resultInput.away.players=uq.getPlayersByTeam(uq.getMatchById(uq.datoViajero).away);
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
                            if (uq.signins[v].accepted == 1) { uq.signins[v].accepted = true; } else { uq.signins[v].accepted = false; }
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
                            uq.standings[v].tournamentID = parseInt(uq.standings[v].tournamentID);
                            uq.standings[v].round = parseInt(uq.standings[v].round);
                            uq.standings[v].points = parseInt(uq.standings[v].points);
                            uq.standings[v].team = parseInt(uq.standings[v].team);
                            uq.standings[v].won = parseInt(uq.standings[v].won);
                            uq.standings[v].draw = parseInt(uq.standings[v].draw);
                            uq.standings[v].lost = parseInt(uq.standings[v].lost);
                            uq.standings[v].goalsFor = parseInt(uq.standings[v].goalsFor);
                            uq.standings[v].goalsAgainst = parseInt(uq.standings[v].goalsAgainst);
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
                    case "SPO":
                        uq.sponsors = data.sponsors;
                        indexFactory.sponsors = uq.sponsors;
                        break;
                    case "CAL":
                        uq.calendar = data.calendar;
                        indexFactory.calendar = uq.calendar;
                        for (var v = 0; v < uq.calendar.length; v++) {
                            uq.calendar[v].affectedID = parseInt(uq.calendar[v].affectedID);
                            uq.calendar[v].limitDate = new Date(uq.calendar[v].limitDate);
                            var actualDate = new Date();
                            var difference = uq.calendar[v].limitDate.getTime() - actualDate.getTime();
                            if (difference > 0) {
                                uq.counters.push({ id: uq.calendar[v].affectedID, counter: difference })
                            }
                        }
                        break;
                    case "CONSTANTS":
                        uq.constants = data.constants;
                        indexFactory.constants = uq.constants;
                        for (var v = 0; v < uq.constants.length; v++) {
                            uq.constants[v].untouchables = parseInt(uq.constants[v].untouchables);
                            uq.constants[v].forcedSignins = parseInt(uq.constants[v].forcedSignins);
                            uq.constants[v].marketEdition = parseInt(uq.constants[v].marketEdition);
                            uq.constants[v].marketOpened = parseInt(uq.constants[v].marketOpened);
                            uq.constants[v].forcedSigninsOpened = parseInt(uq.constants[v].forcedSigninsOpened);
                            uq.constants[v].intervalActual = parseInt(uq.constants[v].intervalActual);
                            uq.constants[v].actualPosition = parseInt(uq.constants[v].actualPosition);
                        }
                        break;
                    case "ORDER":
                        uq.teamOrder = data.teamOrder;
                        indexFactory.teamOrder = uq.teamOrder;
                        for (var v = 0; v < uq.teamOrder.length; v++) {
                            uq.teamOrder[v].user = parseInt(uq.teamOrder[v].user);
                            uq.teamOrder[v].position = parseInt(uq.teamOrder[v].position);
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
appIni.factory("indexFactory", function() {
    //var user = { id: -1, user: 'axelldf6', pass: 'infinito6', email: '', valid: false, teamName: '', teamID: -1, teamImage: '' };
    //var user = { id: -1, user: 'admin', pass: 'swc2017', email: '', valid: false, teamName: '', teamID: -1, teamImage: '' };
    var user = { id: -1, user: '', pass: '', email: '', valid: false, teamName: '', teamID: -1, teamImage: ''};
    var positions = [{ code: "POR", description: "Portero" }, { code: "LD", description: "Lateral Derecho" }, { code: "DFC", description: "Defensa Central" }, { code: "LI", description: "Lateral Izquierdo" }, { code: "MCD", description: "Mediocentro Defensivo" }, { code: "MC", description: "Mediocentro" }, { code: "MI", description: "Medio Izquierdo" }, { code: "MD", description: "Medio Derecho" }, { code: "MCO", description: "Mediapunta" }, { code: "EI", description: "Extremo Izquierdo" }, { code: "DC", description: "Delantero Centro" }, { code: "ED", description: "Extremo Derecho" }];
    var tournaments = ["Primera", "Segunda", "Copa", "Champions League", "Europa League", "Intertoto", "Supercopa Europea", "Supercopa Clubes"];
    var newPlayers = [];
    var newMatches = [];
    var interfaz = {
        datoViajero: -1,
        getUser: function() {
            return user;
        },
        setUser: function(newUser) {
            user = newUser;
        },
        getPositions: function() {
            return positions;
        },
        getTournaments: function() {
            return tournaments;
        },
        getNewPlayers: function() {
            return newPlayers;
        },
        getNewMatches: function() {
            return newMatches;
        }
    }
    return interfaz;
});