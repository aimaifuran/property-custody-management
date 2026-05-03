<?php
session_start();
require_once('conn.php');
date_default_timezone_set('Asia/Manila');

$db = new DBConnection();

$user_id = $_SESSION['id'];
$assigned_station = $_SESSION['station_id'];


$getStationNameQry = $db->conn->query("SELECT * FROM `stations` WHERE id = '$assigned_station'");
$getStationName = mysqli_fetch_assoc($getStationNameQry);
$stationName = $getStationName["station_name"];


$getUserInfoQry = $db->conn->query("SELECT * FROM `users` WHERE id = '$user_id'");
$getUserInfo = mysqli_fetch_assoc($getUserInfoQry);
$uid = $getUserInfo['id'];
$firstname = $getUserInfo['firstname'];
$lastname = $getUserInfo['lastname'];
$email = $getUserInfo['email'];
$gender = $getUserInfo['gender'];
$username = $getUserInfo['username'];
$avatar = $getUserInfo['avatar'];


?>