
<?php
  define('DEBUG_AUTH', false);
  define("BASE_DIR", "../docs/php/");
  header('Content-Type: application/json;charset=utf-8');
  ini_set('upload_max_filesize', '10M');
  ini_set('post_max_size', '10M');
  ini_set('max_execution_time', 300);
  session_start();
	$db_host="localhost";
	$db_name="id1956157_swc";
	$db_user="id1956157_swcadmin";
	$db_pass="swc2017swc2017";

	$link=mysqli_connect($db_host, $db_user, $db_pass) or die ("Error conectando a la base de datos - " . mysql_error());
	mysqli_select_db($link, $db_name) or die("Error seleccionando la base de datos.");
	
  refreshCalendar($link);
  //closeMatches($link);

  function updateLimitDate($con, $ld)
  {
    $time = strtotime($ld);
    $myFormatForView = date("i", $time);
    echo $ld . "\n" . $myFormatForView . "\n\n";
    /*if(%10!=0)
    {

    }*/
    return $ld;
  }

  function refreshCalendar($con)
  {
    $data = array();
    $query="SELECT * from calendar";
    $resultado=mysqli_query($con, $query) or die("Error recuperando calendario");
    while($row = mysqli_fetch_array($resultado))
    {
      $date = new DateTime();
      $limitDate=new DateTime($row['limit_date']);
      $limitDate=updateLimitDate($con, $limitDate);
      date_add($date, date_interval_create_from_date_string('2 hours'));
      $interval = date_diff($date, $limitDate);
      if(strcmp($interval->format("%y/%m/%d %h:%i"), "0/0/0 0:0") == 0) {
        switch($row['type']){
          case "S":
            closeAuction($con, $row['affected_id']);
            break;
          case "C":
            closeForcedSigns($con);
            break;
          case "M":
            closeMarket($con);
            break;
          case "O":
            openMarket($con);
            break;
          case "R":
            discountSalaries($con);
            break;
          case "T":
            openTournament($con, $row['affected_id']);
            break;
          default:
            invalidRequest();
        }
      }
    }
    $data['success'] = true;
    $data['message'] = "CronJob completado";
    echo json_encode($data);
    exit;
  }

  function closeAuction($con, $id)
  {
    $data = array();
    $query="UPDATE signins SET accepted=1 where id=" . $id;
    $resultado=mysqli_query($con, $query) or die("Error cerrando subasta");
    $query4="SELECT * from signins";
    $resultado4=mysqli_query($con, $query4) or die("Error recuperando subasta");
    $player=-1;
    $teamID=-1;
    $amount=0;
    while($row = mysqli_fetch_array($resultado4))
    {
        $idSignin=$row['id'];
        if($id==$idSignin)
        {
          $player=$row['player'];
          $teamID=$row['buyer_team'];
          $amount=$row['amount'];
        }
    }
    $query2="UPDATE players SET team_id=".$teamID.", salary=0.1 where id=" . $player;
    $resultado2=mysqli_query($con, $query2) or die("Error traspasando jugador");
    $query3="UPDATE teams SET budget=budget-".$amount." where id=" . $teamID;
    $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto");
  }

  function openMarket($con, $params)
  {
    $data = array();
    $query="UPDATE constants SET market_opened=1, forced_signins_opened=1";
    $resultado=mysqli_query($con, $query) or die("Error abriendo mercado");
    $query2="UPDATE constants SET market_edition=market_edition+1";
    $resultado2=mysqli_query($con, $query2) or die("Error aumentando mercado");
    $data['success'] = true;
    $data['message'] = "Mercado abierto";
    echo json_encode($data);
    exit;
  }

  function closeForcedSigns($con, $params)
  {
    $data = array();
    $query="UPDATE constants SET forced_signins_opened=0";
    $resultado=mysqli_query($con, $query) or die("Error cerrando clausulas");
    $data['success'] = true;
    $data['message'] = "Clausulas cerradas";
    echo json_encode($data);
    exit;
  }

  function closeMarket($con, $params)
  {
    $data = array();
    $query="UPDATE constants SET market_opened=0";
    $resultado=mysqli_query($con, $query) or die("Error cerrando mercado");
    $data['success'] = true;
    $data['message'] = "Mercado cerrado";
    echo json_encode($data);
    exit;
  }

  function doOffer($con, $params)
  {
    $data = array();
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->offerTeam.",".$params->amount.", 'F', ".$params->market.", false)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['success'] = true;
    $data['message'] = "Cláusula realizada";
    echo json_encode($data);
    exit;
  }

  function acceptOffer($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=".$params->newTeam." where id=".$params->player."";
    $resultado=mysqli_query($con, $query) or die("Error realizando fichaje");
    $query2="UPDATE signins SET accepted=1 where id=". $params->id."";
    $resultado2=mysqli_query($con, $query2) or die("Error actualizando fichaje");
    $query3="UPDATE teams SET budget=budget-" . $params->amount . " where id=". $params->newTeam."";
    $resultado3=mysqli_query($con, $query3) or die("Error actualizando presupuesto1");
    $query4="UPDATE teams SET budget=budget+" . $params->amount . " where id=". $params->oldTeam."";
    $resultado4=mysqli_query($con, $query4) or die("Error actualizando presupuesto2");
    $data['success'] = true;
    $data['message'] = "Oferta aceptada";
    echo json_encode($data);
    exit;
  }

  function rejectOffer($con, $params)
  {
    $data = array();
    $query="DELETE FROM signins where id=".$params->id."";
    $resultado=mysqli_query($con, $query) or die("Error rechazando oferta");
    $data['success'] = true;
    $data['message'] = "Oferta rechazada";
    echo json_encode($data);
    exit;
  }

  function signWildCard($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=". $params->team ." where id=" . $params->player;
    $resultado=mysqli_query($con, $query) or die("Error contratando jugador");
    $query2="INSERT INTO signins (player,buyer_team,amount,type,market,accepted) values (".$params->player.",".$params->team.", 0, 'W', ".$params->market.", true)";
    $resultado2=mysqli_query($con, $query2) or die("Error insertando fichaje");
    $data['success'] = true;
    $data['message'] = "Jugador contratado";
    echo json_encode($data);
    exit;
  }

  function saveUser($con, $params)
  {
    $data = array();
    $query="INSERT INTO users (email,user,pass) values ('".$params->email."','".$params->user."','".$params->pass."')";
    $resultado=mysqli_query($con, $query) or die("Error insertando usuario");
    $data['success'] = true;
  	$data['message'] = "Usuario insertado";
    echo json_encode($data);
  	exit;
  }

  function updateUser($con, $params)
  {
    $data = array();
    $query="UPDATE users SET team_id=".$params->teamID.",user='".$params->user."',pass='".$params->pass."' where id=".$params->id."";
    $resultado=mysqli_query($con, $query) or die("Error actualizando usuario");
    $data['success'] = true;
  	$data['message'] = "Usuario actualizado";
    echo json_encode($data);
  	exit;
  }
  /*
  function subirDocumento($con)
  {
	if( $_FILES['archivo']['type']=='application/pdf')
    {
		$cadu='';
		if($_POST['caducidad']!='')
		{
			$cadu=date('d/m/Y', strtotime("+".$_POST['caducidad']." days"));
		}
        $origen = $_FILES['archivo']['tmp_name'];
        $destino = 'docspdf/ID'.$_POST['id'].'-'.$_POST['usuario'].'-'.$_POST['documento'].".pdf";
        move_uploaded_file($origen, $destino);
		$query="UPDATE documentosfra SET modificado=1,enlace='".$destino."', fecha_caducidad='".$cadu."' where id=".$_POST['id']."";
		$resultado=mysqli_query($con, $query) or die("Error en la base de datos" . mysql_error());
    }
	echo "<script language='javascript'>window.location='index.html'</script>;";
  }*/
  
  function addZero($number)
  {
    if($number<10){$number="0"+$number;}
    return $number;
  }

  function obtainTeams($con)
  {
    $data = array();
    $query="SELECT * from teams";
    $resultado=mysqli_query($con, $query) or die("Error recuperando equipos");
  
    $teams=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
        $budget=$row['budget'];
        $teamImage=$row['image_route'];
        $teams[] = array('id'=> $id, 'name'=> $name, 'budget'=> $budget, 'teamImage'=> $teamImage);
    }
    $data['teams']=$teams;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainPlayers($con)
  {
    $data = array();
    $query="SELECT * from players";
    $resultado=mysqli_query($con, $query) or die("Error recuperando jugadores");
  
    $players=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
        $salary=$row['salary'];
        $teamID=$row['team_id'];
        $position=utf8_decode($row['position']);
        $players[] = array('id'=> $id, 'teamID'=> $teamID, 'name'=> $name, 'salary'=> $salary, 'position'=> $position);
    }
    $data['players']=$players;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainMatches($con)
  {
    $data = array();
    $query="SELECT * from matches";
    $resultado=mysqli_query($con, $query) or die("Error recuperando partidos");
  
    $matches=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $local=$row['user'];
        $away=$row['away'];
        $tournament=$row['tournament'];
        $round=$row['round'];
        $localGoals=$row['local_goals'];
        $awayGoals=$row['away_goals'];
        $limitDate=$row['limit_date'];
        $matches[] = array('id'=> $id, 'tournament'=> $tournament, 'round'=> $round, 'local'=> $local, 'away'=> $away, 'localGoals'=> $localGoals, 'awayGoals'=> $awayGoals, 'limitDate'=> $limitDate);
    }
    $data['matches']=$matches;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainActions($con)
  {
    $data = array();
    $query="SELECT * from actions";
    $resultado=mysqli_query($con, $query) or die("Error recuperando acciones");
  
    $actions=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $matchID=$row['match_id'];
        $type=utf8_decode($row['type']);
        $player=$row['player'];
        $actions[] = array('matchID'=> $matchID, 'type'=> $type, 'player'=> $player);
    }
    $data['actions']=$actions;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainSignins($con)
  {
    $data = array();
    $query="SELECT * from signins";
    $resultado=mysqli_query($con, $query) or die("Error recuperando fichajes");
  
    $signins=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $player=$row['player'];
        $buyerTeam=$row['buyer_team'];
        $amount=$row['amount'];
        $type=utf8_decode($row['type']);
        $market=$row['market'];
        $accepted=$row['accepted'];
        $signins[] = array('id'=> $id, 'amount'=> $amount, 'player'=> $player, 'buyerTeam'=> $buyerTeam, 'type'=> $type, 'market'=> $market, 'accepted'=> $accepted);
    }
    $data['signins']=$signins;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainPlayerChangeSignins($con)
  {
    $data = array();
    $query="SELECT * from player_change_signins";
    $resultado=mysqli_query($con, $query) or die("Error recuperando intercambios de jugadores en fichajes");
  
    $playerChangeSignins=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $signinID=$row['signin_id'];
        $player=$row['player'];
        $originTeam=$row['origin_team'];
        $newTeam=$row['new_team'];
        $playerChangeSignins[] = array('signinID'=> $signinID, 'newTeam'=> $newTeam, 'player'=> $player, 'originTeam'=> $originTeam);
    }
    $data['playerChangeSignins']=$playerChangeSignins;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTournaments($con)
  {
    $data = array();
    $query="SELECT * from tournaments";
    $resultado=mysqli_query($con, $query) or die("Error recuperando torneos");
  
    $tournaments=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $name=utf8_decode($row['name']);
        $edition=$row['edition'];
        $tournaments[] = array('name'=> $name, 'edition'=> $edition);
    }
    $data['tournaments']=$tournaments;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainStandings($con)
  {
    $data = array();
    $query="SELECT * from standings";
    $resultado=mysqli_query($con, $query) or die("Error recuperando clasificaciones");
  
    $standings=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $tournamentID=$row['tournament_id'];
        $team=$row['team'];
        $round=$row['round'];
        $points=$row['points'];
        $won=$row['won'];
        $draw=$row['draw'];
        $lost=$row['lost'];
        $goalsFor=$row['goals_for'];
        $goalsAgainst=$row['goals_against'];
        $standings[] = array('tournamentID'=> $tournamentID, 'round'=> $round, 'team'=> $team, 'points'=> $points, 'round'=> $round, 'won'=> $won, 'draw'=> $draw, 'lost'=> $lost, 'goalsFor'=> $goalsFor, 'goalsAgainst'=> $goalsAgainst);
    }
    $data['standings']=$standings;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function obtainTeamRequests($con)
  {
    $data = array();
    $query="SELECT * from team_requests";
    $resultado=mysqli_query($con, $query) or die("Error recuperando solicitudes de equipo");
  
    $teamRequests=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $user=$row['user'];
        $requestDate=$row['request_date'];
        $teamRequests[] = array('user'=> $user, 'requestDate'=> $requestDate);
    }
    $data['teamRequests']=$teamRequests;
    $data['success'] = true;
    $data['message'] = "Datos recogidos";
    echo json_encode($data);
    exit;
  }

  function invalidRequest()
  {
  	$data = array();
  	$data['success'] = false;
  	$data['message'] = "Petición inválida";
  	echo json_encode($data);
  	exit;
  }

  mysqli_close($link);
?>
