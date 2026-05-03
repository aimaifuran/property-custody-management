<?php
session_start();
require_once('conn.php');

$db = new DBConnection;
$conn = $db->conn;

class Master extends DBConnection{
	public function __construct(){
		parent::__construct();
		date_default_timezone_set('Asia/Manila');
	}
	public function __destruct(){
		parent::__destruct();
	}
	function capture_err(){
		if(!$this->conn->error)
			return false;
		else{
			$response['status'] = 'failed';
			$response['error'] = $this->conn->error;
			return json_encode($response);
			exit;
		}
	}


	public function audit_trail($user_id, $log){
		$stmt = $this->conn->prepare("INSERT INTO audit_trail (user_id, log) VALUES (?, ?)");
		$stmt->bind_param("ss", $user_id, $log);
		
		$result = $stmt->execute();
		if(!$result){
			return false;
		}
		return true;
	}

	function update_weather(){
		extract($_POST);
		$current_date = date('Y-m-d');
		if($last_update === $current_date){
			$response['success'] = false;
			$response['message'] = "Weather is already up to date";
		}
		else{
			$stmt = $this->conn->prepare("UPDATE `stations` SET temperature = ?, weather_description = ?, weather_icon = ?, last_update = ? WHERE id = ?");
			$stmt->bind_param("sssss", $temperature, $weather_description, $weather_icon, $current_date, $station_id);
			
			$result = $stmt->execute();
		
			if (!$result) {
				$response['success'] = false;
				$response['message'] = "Error: ". $this->conn->error;
			} else {
				$response['success'] = true;
				$response['message'] = "Successfully updated weather.";
			}
		
			$stmt->close();
		}
		
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function add_new_gatherer(){
		extract($_POST);
		$password = md5($password);
		$user_type = 2; 
		$stmt = $this->conn->prepare("INSERT INTO `users` (firstname, lastname, email, gender, username, password, user_type, assigned_station) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssssii", $firstname, $lastname, $email, $gender, $username, $password, $user_type, $assigned_station);
		
		$result = $stmt->execute();
	
		if (!$result) {
			$response['success'] = false;
			$response['message'] = "Error: ". $this->conn->error;
		}
		$user_id = $_SESSION['id'];
		$getStationQry = $this->conn->query("SELECT * FROM `stations` WHERE id = '$assigned_station'");
		$getStation = mysqli_fetch_assoc($getStationQry);
		$log = "Added new gatherer ". $firstname. " ". $lastname . " and assigned to " . $getStation['station_name'] . " Station.";
		$auditRes = $this->audit_trail($user_id, $log);
		if(!$auditRes){
			$response['success'] = false;
			$response['message'] = "Faild to record audit trail";
		}
		$response['success'] = true;
		$response['message'] = "Successfully added new gatherer.";
		
	
		$stmt->close();
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function add_new_station(){
		extract($_POST);
		$stmt = $this->conn->prepare("INSERT INTO `stations` (station_name, latitude, longitude) VALUES (?, ?, ?)");
		$stmt->bind_param("sss", $station_name, $latitude, $longitude);
		
		$result = $stmt->execute();
	
		if (!$result) {
			$response['success'] = false;
			$response['message'] = "Error: ". $this->conn->error;
		}
		$user_id = $_SESSION['id'];
		$log = "Added new station: ". $station_name.".";
		$auditRes = $this->audit_trail($user_id, $log);
		if(!$auditRes){
			$response['success'] = false;
			$response['message'] = "Faild to record audit trail";
		}
		
		$response['success'] = true;
		$response['message'] = "Successfully added new station.";
		
	
		$stmt->close();
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function update_filter(){
		extract($_POST);
		$update_filter = $_SESSION['filter'] = $filter;
		if (!$update_filter) {
			$response['success'] = false;
			$response['message'] = "Error: ". $this->conn->error;
		}
		$response['success'] = true;
		$response['message'] = "Filter Updated";
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function update_filter_audit(){
		extract($_POST);
		$update_filter = $_SESSION['filterAudit'] = $filterAudit;
		if (!$update_filter) {
			$response['success'] = false;
			$response['message'] = "Error: ". $this->conn->error;
		}
		$response['success'] = true;
		$response['message'] = "Filter Updated";
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}
	
	function save_data(){
		extract($_POST);
		$now = date('Y-m-d');
		$checkResetStatus = $this->conn->query("SELECT * FROM status WHERE last_update != '$now'");
		if($checkResetStatus->num_rows > 0){
			$this->conn->query("DELETE FROM status");
		}
		// Check if the user already added a data for today
		$checkIfAlreadeSubmitted = $this->conn->query("SELECT * FROM data WHERE station_id = '$assigned_station' AND date = '$now'");
		if($checkIfAlreadeSubmitted->num_rows > 0){
			$response['success'] = false;
			$response['message'] = "You have already submitted a data today.";
			header('Content-Type: application/json');
			echo json_encode($response);
			exit;
		}
		for ($i = 0; $i < count($_POST['parameter_id']); $i++) {
			$station_id = $_SESSION['station_id'];
			$getStationNameQry = $this->conn->query("SELECT * FROM `stations` WHERE id = '$station_id'");
			$getStationName = mysqli_fetch_assoc($getStationNameQry);
			$station_name = $getStationName['station_name'];
			$param_name = explode("(", $_POST['parameter_name'][$i]);
			$param_name = $param_name[0];
				
			$parameter_id = $_POST['parameter_id'][$i];
			$value = $_POST['value'][$i];
			$status = '';
			
			// Status
			$getRangeQry = $this->conn->query("SELECT * FROM parameters WHERE id = '$parameter_id'");
			$getRange = mysqli_fetch_assoc($getRangeQry);
			$range = explode("-", $getRange['normal_range']);
			if($value < $range[0] || $value > (int)$range[1]){
				$status = 'Critical';
			}
			else{
				$status = 'Normal';
			}
			
			$stmt = $this->conn->prepare("INSERT INTO `data` (station_id, parameter_id, value) VALUES (?, ?, ?)");
			$stmt->bind_param("sss", $assigned_station, $parameter_id, $value);
			$result = $stmt->execute();

			$changeStatus = $this->conn->prepare("INSERT INTO `status` (parameter_id,station_id,  status) VALUES (?, ?, ?)");
			$changeStatus->bind_param("sss", $parameter_id, $assigned_station, $status);
			$changeStatus->execute();

			// Path to the CSV file
			$csvFilePath = "../admin/machineLearning/models/$station_name/$param_name.csv";

			// Read existing data from the CSV file
			$data = array_map('str_getcsv', file($csvFilePath));

			// Add the new Temperature value to the existing data
			$newRow = [$value];
			$data[] = $newRow;

			// Write the updated data back to the CSV file
			$file = fopen($csvFilePath, 'w');
			foreach ($data as $row) {
				fputcsv($file, $row);
			}
			fclose($file);
		
			if (!$result) {
				$response['success'] = false;
				$response['message'] = "Error: ". $this->conn->error;
			}


		}
		$stmt->close();

		$user_id = $_SESSION['id'];
		$getStationQry = $this->conn->query("SELECT * FROM `stations` WHERE id = '$assigned_station'");
		$getStation = mysqli_fetch_assoc($getStationQry);
		$log = $_SESSION['firstname']." ".$_SESSION['lastname']." from ".$getStation['station_name']." Station added a new data.";
		$auditRes = $this->audit_trail($user_id, $log);
		if(!$auditRes){
			$response['success'] = false;
			$response['message'] = "Faild to record audit trail";
		}
		$response['success'] = true;
		$response['message'] = "Data sent to admin.";
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function update_profile(){
		extract($_POST);
		$getPass = $this->conn->query("SELECT * FROM users WHERE id = '$uid'");
		$verify_pass = mysqli_fetch_assoc($getPass);

		$uploadDir = '../assets/images/avatar/';
		$avatarPath = '';
		$avatarName = '';
		if (!empty($_FILES['avatar'])) {
			$avatarName = basename($_FILES['avatar']['name']);
			$avatarPath = $uploadDir . $avatarName;
			move_uploaded_file($_FILES['avatar']['tmp_name'], $avatarPath);
		}
		else{
			$avatarName = $verify_pass['avatar'];
		}

		if($current_password === ''){
			$stmt = $this->conn->prepare("UPDATE `users` SET firstname = ?, lastname = ?, email = ?, gender = ?, username = ?, avatar = ? WHERE id = ?");
			$stmt->bind_param("sssssss", $firstname, $lastname, $email, $gender, $username, $avatarName, $uid);
			$stmt->execute();
			$stmt->close();
			$response['success'] = true;
			$response['message'] = "Profile updated!";
		}
		else{
			if(md5($current_password) == $verify_pass["password"]){
				$hashed = md5($new_password);
				$stmt = $this->conn->prepare("UPDATE `users` SET firstname = ?, lastname = ?, email = ?, gender = ?, username = ?, password = ?, avatar = ? WHERE id = ?");
				$stmt->bind_param("ssssssss", $firstname, $lastname, $email, $gender, $username, $hashed, $avatarName, $uid);
				$stmt->execute();
				$stmt->close();
				$response['success'] = true;
				$response['message'] = "Profile updated!";
			}
			else{
				$response['success'] = false;
				$response['message'] = "Current password is incorrect!";
			}
		}
		
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	public function remove_gatherer(){
		extract($_POST);
		$stmt = $this->conn->prepare("DELETE FROM users WHERE id = ?");
		$stmt->bind_param("s", $user_id);
		$stmt->execute();
		if(!$stmt){
			$response['success'] = false;
            $response['message'] = "Error: ". $this->conn->error;
		}
		$response['success'] = true;
		$response['message'] = "Gatherer removed!";
		$log = "Removed $name as Gatherer from $station Station.";
		$this->audit_trail($_SESSION['id'], $log);
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function add_parameter(){
		extract($_POST);

		$uploadDir = '../assets/images/parameters/';
		$iconPath = '';
		$iconName = '';
		$iconName = basename($_FILES['icon']['name']);
		$iconPath = $uploadDir . $iconName;
		move_uploaded_file($_FILES['icon']['tmp_name'], $iconPath);
		

		$stmt = $this->conn->prepare("INSERT INTO parameters (parameter_name, normal_range, icon) VALUES (?, ?, ?)");
		$stmt->bind_param("sss", $parameter_name, $normal_range, $iconName);
		$stmt->execute();
		$stmt->close();
		if(!$stmt){
			$response['success'] = false;
            $response['message'] = "Error: ". $this->conn->error;
		}
		$response['success'] = true;
		$response['message'] = "Successfully added new parameter.";
		
		
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}
    
	function update_parameter(){
		extract($_POST);
		$getParameter = $this->conn->query("SELECT * FROM parameters WHERE id = '$param_id'");
		$parameterInfo = mysqli_fetch_assoc($getParameter);

		$uploadDir = '../assets/images/parameters/';
		$iconPath = '';
		$iconName = '';
		if (!empty($_FILES['new_icon'])){
			$iconName = basename($_FILES['new_icon']['name']);
			$iconPath = $uploadDir . $iconName;
			move_uploaded_file($_FILES['new_icon']['tmp_name'], $iconPath);
		}
		else{
			$iconName = $parameterInfo['icon'];
		}
		

		$stmt = $this->conn->prepare("UPDATE parameters SET parameter_name=?, normal_range=?, icon=? WHERE id=?");
		$stmt->bind_param("ssss", $new_parameter_name, $new_normal_range, $iconName, $param_id);
		$stmt->execute();
		$stmt->close();
		if(!$stmt){
			$response['success'] = false;
            $response['message'] = "Error: ". $this->conn->error;
		}
		$response['success'] = true;
		$response['message'] = "Successfully updated parameter.";
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}

	function delete_parameter(){
		extract($_POST);
		$stmt = $this->conn->prepare("DELETE FROM parameters WHERE id=?");
		$stmt->bind_param("s", $param_id);
		$stmt->execute();
		if(!$stmt){
			$response['success'] = false;
            $response['message'] = "Error: ". $this->conn->error;
		}
		$stmt->close();
		$response['success'] = true;
		$response['message'] = "Parameter deleted!";
		header('Content-Type: application/json');
		echo json_encode($response);
		exit;
	}
}

$Master = new Master();
$action = !isset($_GET['f']) ? 'none' : strtolower($_GET['f']);
switch($action){
	case 'add_new_gatherer':
		echo $Master->add_new_gatherer();
		break;
	case 'add_new_station':
		echo $Master->add_new_station();
		break;
	case 'update_filter':
		echo $Master->update_filter();
		break;
	case 'update_filter_audit':
		echo $Master->update_filter_audit();
		break;
	case 'save_data':
		echo $Master->save_data();
		break;
	case 'update_weather':
		echo $Master->update_weather();
		break;
	case 'update_profile':
		echo $Master->update_profile();
		break;
	case 'remove_gatherer':
		echo $Master->remove_gatherer();
		break;
	case 'add_parameter':
		echo $Master->add_parameter();
		break;
	case 'update_parameter':
		echo $Master->update_parameter();
		break;
	case 'delete_parameter':
		echo $Master->delete_parameter();
		break;
	

    default:
		break;
}

?>