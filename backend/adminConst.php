<?php
require_once('conn.php');
date_default_timezone_set('Asia/Manila');

$db = new DBConnection();
// $res = json_encode($db);
// echo "<script>alert('".$res."')</script>";

$countStatiosQry = $db->conn->query("SELECT * FROM `stations`");
$countStatios = mysqli_num_rows($countStatiosQry);

$countGatherersQry = $db->conn->query("SELECT * FROM `users` WHERE `user_type` = '2'");
$countGatherers = mysqli_num_rows($countGatherersQry);
?>