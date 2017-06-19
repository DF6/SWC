
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
	$params = json_decode(file_get_contents("php://input"));
	
  if(isset($params->type) && !empty($params->type))
  {
    $type=$params->type;
    if(strcmp($type, "recDat") == 0)
    {
      $datatype=$params->dataType;
      switch ($datatype) {
        case "U":
          obtainUsers($link);
            break;
        case "T":
          obtainTeams($link);
          break;
        case "M":
          obtainMatches($link);
          break;
        case "A":
          obtainActions($link);
          break;
        case "P":
          obtainPlayers($link);
          break;
        case "S":
          obtainSignins($link);
          break;
        case "PCS":
          obtainPlayerChangeSignins($link);
          break;
        case "TO":
          obtainTournaments($link);
          break;
        case "ST":
          obtainStandings($link);
          break;
        case "RT":
          obtainTeamRequests($link);
          break;
        default:
          invalidRequest();
     }
   }else{
    switch($type)
    {
       case "solEqu":
          requestTeam($link, $params);
            break;
       case "givTea":
          giveTeamToRequester($link, $params);
            break;
       case "disPla":
          discardPlayer($link, $params);
            break;
        default:
          invalidRequest();
    }
   }
  }else{
    invalidRequest();
  }

  function requestTeam($con, $params)
  {
    $data = array();
    $query="INSERT INTO team_requests (user) values (".$params->user.")";
    $resultado=mysqli_query($con, $query) or die("Error solicitando equipo");
    $data['success'] = true;
    $data['message'] = "Equipo solicitado";
    echo json_encode($data);
    exit;
  }

  function giveTeamToRequester($con, $params)
  {
    $data = array();
    $query="UPDATE users SET team_id=" . $params->team . " where id=" . $params->user;
    $resultado=mysqli_query($con, $query) or die("Error asignando equipo");
    $data['success'] = true;
    $data['message'] = "Equipo otorgado";
    echo json_encode($data);
    exit;
  }

  function discardPlayer($con, $params)
  {
    $data = array();
    $query="UPDATE players SET team_id=0 where id=" . $params->player;
    $resultado=mysqli_query($con, $query) or die("Error liberando jugador");
    $data['success'] = true;
    $data['message'] = "Jugador liberado";
    echo json_encode($data);
    exit;
  }

  function saveUser($con, $params)
  {
    $data = array();
    $query="INSERT INTO users (team_id,user,pass) values (".$params->teamID.",'".$params->user."','".$params->pass."')";
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
  
  function obtainUsers($con)
  {
    $data = array();
    $query="SELECT * from users";
    $resultado=mysqli_query($con, $query) or die("Error recuperando usuarios");
	
    $users=array();
    while($row = mysqli_fetch_array($resultado))
    {
        $id=$row['id'];
        $user=utf8_decode($row['user']);
        $pass=utf8_decode($row['pass']);
        $email=utf8_decode($row['email']);
        $teamID=$row['team_id'];
        $users[] = array('id'=> $id, 'teamID'=> $teamID, 'user'=> $user, 'pass'=> $pass, 'email'=> $email);
    }
    $data['users']=$users;
    $data['success'] = true;
  	$data['message'] = "Datos recogidos";
	  echo json_encode($data);
  	exit;
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
        $players[] = array('id'=> $id, 'teamID'=> $teamID, 'name'=> $name, 'salary'=> $salary);
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
        $localGoals=$row['local_goals'];
        $awayGoals=$row['away_goals'];
        $limitDate=$row['limit_date'];
        $matches[] = array('id'=> $id, 'tournament'=> $tournament, 'local'=> $local, 'away'=> $away, 'localGoals'=> $localGoals, 'awayGoals'=> $awayGoals, 'limitDate'=> $limitDate);
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
        $signins[] = array('id'=> $id, 'amount'=> $amount, 'player'=> $player, 'buyerTeam'=> $buyerTeam);
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

  mysql_close($link);
?>
