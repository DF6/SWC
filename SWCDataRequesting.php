
<?php
  define('DEBUG_AUTH', false);
  define("BASE_DIR", "../docs/php/");
  header('Content-Type: application/json;charset=utf-8');
  ini_set('upload_max_filesize', '10M');
  ini_set('post_max_size', '10M');
  ini_set('max_execution_time', 300);
  session_start();
	$db_host="";
	$db_name="";
	$db_user="";
	$db_pass="";

	$link=mysql_connect($db_host, $db_user, $db_pass) or die ("Error conectando a la base de datos - " . mysql_error());
	mysql_select_db($db_name ,$link) or die("Error seleccionando la base de datos.");
	$params = json_decode(file_get_contents("php://input"));
	
  if(isset($params->type) && !empty($params->type))
  {
    $type=$params->type;

    switch ($type) {
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
  	default:
  		invalidRequest();
	   }
  }else{
    invalidRequest();
  }

  function saveUser($con,$params)
  {
    $data = array();
    $query="INSERT INTO users (team_id,user,pass) values (".$params->teamID.",'".$params->user."','".$params->pass."')";
    $resultado=mysql_query($query) or die("Error insertando usuario");
    $data['success'] = true;
  	$data['message'] = "Usuario insertado";
    echo json_encode($data);
  	exit;
  }

  function updateUser($con,$params)
  {
    $data = array();
    $query="UPDATE users SET team_id=".$params->teamID.",user='".$params->user."',pass='".$params->pass."' where id=".$params->id."";
    $resultado=mysql_query($query) or die("Error actualizando usuario");
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
		$resultado=mysql_query($query) or die("Error en la base de datos" . mysql_error());
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
    $resultado=mysql_query($query) or die("Error recuperando usuarios");
	
    $users=array();
    while($row = mysql_fetch_array($resultado))
    {
        $id=$row['id'];
        $user=utf8_decode($row['user']);
        $pass=utf8_decode($row['pass']);
        $teamID=$row['team_id'];
        $users[] = array('id'=> $id, 'teamID'=> $teamID, 'user'=> $user, 'pass'=> $pass);
    }
    $data['users']=$users;
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
