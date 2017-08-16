var appIni = angular.module('appIni', ['ngRoute']);
appIni.config(function($routeProvider) {
    $routeProvider
        .when("/", { controller: "appCtrl", controllerAs: "vm", templateUrl: "ini.html" })
        .when("/premier", { controller: "appCtrl", controllerAs: "vm", templateUrl: "premier.html" })
        .when("/cup", { controller: "appCtrl", controllerAs: "vm", templateUrl: "cup.html" })
        .when("/champions", { controller: "appCtrl", controllerAs: "vm", templateUrl: "champions.html" })
        .when("/second", { controller: "appCtrl", controllerAs: "vm", templateUrl: "second.html" })
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
    uq.newAuctionObj = { name: "", overallRange: 40, positionSelected: "" };
    /*$http.post("cronjobs.php", {})
                .success(function(data) {})
                .error(function(error) {
                  console.log(error);
                  Materialize.toast('Mal', 5000, 'rounded');
                });*/
    obtainData("T");
    switch ($location.path()) {
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
            uq.onTimeout = function() {
                angular.forEach(uq.counters, function(value, key) {
                    value.counter -= 1000;
                });
                uq.showDateFromCounters();
                uq.mytimeout = $timeout(uq.onTimeout, 1000);
            }
            uq.mytimeout = $timeout(uq.onTimeout, 1000);
            break;
        case "/newauction":
            obtainData("P");
            obtainData("CAL");
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
        } else {
            indexFactory.setUser(uq.user);
        }
        return uq.user.valido;
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
                            uq.login();
                        })
                        .error(function(error) {
                            console.log(error);
                            Materialize.toast('No se ha podido registrar el usuario', 5000, 'rounded');
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

    uq.giveTeamToRequester = function(requester) {
        if (setAvailableTeams().length != 0) {
            var chosenTeam = 1 + Math.floor(Math.random() * setAvailableTeams().length);
            $http.post("SWCDataRequesting.php", { type: "givTea", user: requester, team: chosenTeam })
                .success(function(data) {
                    uq.teamRequests = [];
                    obtainData("RT");
                    Materialize.toast(uq.getTeamById(chosenTeam).name + ' asignado a ' + uq.getUserById(requester).user, 5000, 'rounded');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido asignar el equipo', 5000, 'rounded');
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
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido descartar el jugador', 5000, 'rounded');
                });
        }
    }

    uq.signWildCard = function(player, team) {
        if (confirm('¿Seguro?')) {
            $http.post("SWCDataRequesting.php", { type: "conLib", player: player, team: team, market: uq.constants[0].marketEdition })
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

    uq.saveSalary = function(player, newSalary) {
        $http.post("SWCDataRequesting.php", { type: "guaSal", player: player, salary: newSalary })
            .success(function(data) {
                Materialize.toast('Salario cambiado', 5000, 'rounded');
                uq.redirEditar('myteam');
            })
            .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido solicitar el equipo', 5000, 'rounded');
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

    uq.canForce = function() {
        var actualSignins = uq.getSigninsByMarketEdition();
        var forcedCount = 0;
        angular.forEach(actualSignins, function(value, key) {
            if (value.transferType == "C") {
                forcedCount++;
            }
        });
        return forcedCount < uq.constants[0].forcedSignins;
    }

    uq.forceSign = function(player, forcerTeam) {
        if (uq.canForce(forcerTeam)) {
            $http.post("SWCDataRequesting.php", { type: "claJug", oldTeam: uq.getPlayerById(player).teamID, player: player, amount: (uq.getPlayerById(player).salary * 10).toFixed(), buyerTeam: forcerTeam, signinType: "C", market: uq.constants[0].marketEdition })
                .success(function(data) {
                    Materialize.toast('Cláusula realizada', 5000, 'rounded');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
                });
        } else {
            Materialize.toast('No te quedan cláusulas', 5000, 'rounded');
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
                        Materialize.toast('Oferta de cesión realizada', 5000, 'rounded');
                        uq.redirEditar('marketresume');
                    })
                    .error(function(error) {
                        console.log(error);
                        Materialize.toast('No se ha podido realizar la cláusula', 5000, 'rounded');
                    });
            } else {
                $http.post("SWCDataRequesting.php", { type: "hacOfe", player: player, amount: uq.offerRange, offerTeam: offerTeam, signinType: "F", market: uq.constants[0].marketEdition })
                    .success(function(data) {
                        if (uq.playersOffered.length != 0) {
                            uq.offerPlayer(parseInt(data.signinID), 0, uq.getPlayerById(player).teamID);
                        }
                        Materialize.toast('Oferta realizada', 5000, 'rounded');
                        uq.redirEditar('marketresume');
                    })
                    .error(function(error) {
                        console.log(error);
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
                    uq.offerPlayer(signin, cont, playerTeam);
                })
                .error(function(error) {
                    console.log(error);
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
                    uq.redirEditar('marketresume');
                })
                .error(function(error) {
                    console.log(error);
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
                    uq.transferOfferedPlayer(playersToChange, cont);
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido transferir el jugador', 5000, 'rounded');
                });
        }
    }

    uq.rejectOffer = function(signin) {
        if (confirm("Rechazar. ¿Seguro?")) {
            $http.post("SWCDataRequesting.php", { type: "recOfe", id: signin })
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
                Materialize.toast('Comienza la subasta', 5000, 'rounded');
                uq.redirEditar('auctions');
            })
            .error(function(error) {
                console.log(error);
                Materialize.toast('No se ha podido realizar la subasta', 5000, 'rounded');
            });
    }

    uq.raiseAuction = function(signin, amount) {
        var dd = new Date();
        if (uq.getCounterById(signin) - dd.getTime() <= 0) {
            $http.post("SWCDataRequesting.php", { type: "pujSub", id: signin, amount: amount, newTeam: uq.user.teamID })
                .success(function(data) {
                    Materialize.toast('Puja subida a ' + (uq.getSigninById(signin).amount + amount), 5000, 'rounded');
                    uq.redirEditar('myteam');
                })
                .error(function(error) {
                    console.log(error);
                    Materialize.toast('No se ha podido realizar la puja', 5000, 'rounded');
                });
        } else {
            Materialize.toast('La subasta está fuera de tiempo', 5000, 'rounded');
        }
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
                Materialize.toast('Reintroducido el importe de salarios de ' + uq.getTeamById(team).name, 5000, 'rounded');
            })
            .error(function(error) {
                console.log(error);
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

    uq.insertMatches = function(matches, counter, round)
    {
      if(counter<matches.length){
        $http.post("SWCDataRequesting.php", { type: "insMat", local: matches[counter][0], away: matches[counter][1], round: round})
            .success(function(data) {
              uq.insertMatches(matches, counter+1, round);
            })
            .error(function(error) {
              console.log(error);
              Materialize.toast('No se han podido insertar partidos', 5000, 'rounded');
            });
      }
    }

    /*uq.prueba = function() {
        var net = [
            [1, 12],
            [2, 11],
            [3, 10],
            [4, 9],
            [5, 8],
            [6, 7]
        ];
        var matches = [];
        rounds = (net.length * 2 - 1);
        for (var y = 0; y < net.length; y++) {
            matches.push(net[y]);
        }
        var newRound = [];
        for (var u = 1; u <= rounds; u++) {
            var aux = -34;
            var aux2 = -34;
            if (newRound.length != 0) {
                net = newRound;
            }
            for (var k = 0; k < net.length; k++) {
                if (k == 0) {
                    aux = net[1][0];
                    net[1][0] = net[0][1];
                    net[0][1] = net[1][1];
                } else if (k == 1 && net.length != 1) {
                    aux2 = aux;
                    aux = net[2][0];
                    net[2][0] = aux2;
                    net[1][1] = net[2][1];
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
            console.log(net);
            newRound = net;
            console.log(newRound);
            for (var y = 0; y < net.length; y++) {
                matches.push(net[y]);
            }
            //net = uq.changeLocalAway(net);
        }
        for (var g = 0; g < matches.length; g++) {
            if (g % net.length == 0) {
                console.log("Siguiente Jornada\n=====================\n");
            }
            console.log(matches[g][0] + " - " + matches[g][1] + "\n");
        }
    }*/

    uq.generate = function() {
        if (uq.teamsOnCompetition.length > 2) {
            switch (uq.tournamentSelected) {
                case "Primera":
                case "Segunda":
                    var rounds = 0;
                    var matches = [];
                    let counter = uq.teamsOnCompetition.length;
                    /*while (counter > 0) {
                        let index = Math.floor(Math.random() * counter);
                        counter--;
                        let temp = uq.teamsOnCompetition[counter];
                        uq.teamsOnCompetition[counter] = uq.teamsOnCompetition[index];
                        uq.teamsOnCompetition[index] = temp;
                    }*/
                    var net = [];
                    //  id  local   away  tournament  round   local_goals   away_goals  limit_date 
                    for (var i = 0; i < uq.teamsOnCompetition.length; i++) {
                        if (i < uq.teamsOnCompetition.length - 1) {
                            net.push([uq.teamsOnCompetition[i], uq.teamsOnCompetition[i + 1]]);
                            i++;
                        } else {
                            net.push([uq.teamsOnCompetition[uq.teamsOnCompetition.length-1], -1]);
                        }
                    }
                    if (uq.teamsOnCompetition.length % 2 == 0) {
                        rounds = (uq.teamsOnCompetition.length - 1);
                        for (var u = 1; u <= rounds; u++) {
                            for (var y = 0; y < net.length; y++) {
                                matches.push(net[y]);
                            }
                            var aux = -34;
                            var aux2 = -34;
                            var aux3 = -34;
                            for (var k = 0; k < net.length; k++) {
                                if (k == 0) {
                                    aux = net[1][0];
                                    net[1][0] = net[0][1];
                                    net[0][1] = net[1][1];
                                } else if (k == 1 && net.length != 1) {
                                    aux2 = aux;
                                    aux = net[2][0];
                                    net[2][0] = aux2;
                                    net[1][1] = net[2][1];
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
                            uq.insertMatches(net, 0, u);
                            //uq.changeLocalAway(net);
                        }
                        for (var y = 0; y < net.length; y++) {
                            matches.push(net[y]);
                        }
                        var matches2 = uq.changeLocalAway(matches);
                        matches.concat(matches2);
                        console.log(matches);
                    } else {
                        rounds = (uq.teamsOnCompetition.length);
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
                            teamnames: round == 1 ? [uq.teamsOnCompetition[teamMark], uq.teamsOnCompetition[teamMark + 1]] : [last[0].teams[_.random(1)], last[1].teams[_.random(1)]],
                            bracketNo: i,
                            roundNo: round,
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
                    console.log(brackets);
                    break;
                case "Champions League":
                    break;
                case "Supercopa Europea":
                case "Supercopa Clubes":
                    break;
            }
        } else {
            Materialize.toast('No hay mínimo dos equipos en liza', 5000, 'rounded');
        }
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
                        if ($location.path() == "/myteam") {
                            uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                        } else if ($location.path() == "/salary") {
                            uq.teamPlayers = uq.getPlayersByTeam(uq.user.teamID);
                            uq.salaryLimit = setSalaryLimit();
                        } else if ($location.path() == "/makeoffer") {
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
    var user = { id: -1, user: 'admin', pass: 'swc2017', email: '', valid: false, teamName: '', teamID: -1, teamImage: '' };
    var positions = [{ code: "POR", description: "Portero" }, { code: "LD", description: "Lateral Derecho" }, { code: "DFC", description: "Defensa Central" }, { code: "LI", description: "Lateral Izquierdo" }, { code: "MCD", description: "Mediocentro Defensivo" }, { code: "MC", description: "Mediocentro" }, { code: "MI", description: "Medio Izquierdo" }, { code: "MD", description: "Medio Derecho" }, { code: "MCO", description: "Mediapunta" }, { code: "EI", description: "Extremo Izquierdo" }, { code: "DC", description: "Delantero Centro" }, { code: "ED", description: "Extremo Derecho" }];
    var tournaments = ["Primera", "Segunda", "Copa", "Champions League", "Europa League", "Intertoto", "Supercopa Europea", "Supercopa de Clubes"];
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
        }
    }
    return interfaz;
});