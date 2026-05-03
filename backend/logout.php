<?php
session_start();
$redirect = '';
if($_SESSION['role'] == 1){
    $redirect = '../index.php';
}
else if($_SESSION['role'] == 2){
    $redirect = '../android/index.php';
}

session_destroy();
$_SESSION['authenticated'] = false;
echo "<script>location.href='".$redirect."'</script>";
?>