<?php
require_once('conn.php');

$db = new DBConnection();

if (isset($_POST['admin-login'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);

    $query = "SELECT * FROM users WHERE username = ? AND password = ? AND user_type = 1 LIMIT 1";
    $stmt = $db->conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if ($user) {
                session_start();
                $filterYearQry = $db->conn->query("SELECT DISTINCT YEAR(date) as year FROM data ORDER BY year DESC LIMIT 1");
                $filterYear = mysqli_fetch_assoc($filterYearQry);
                $_SESSION['authenticated'] = true;
                $_SESSION['id'] = $user['id'];
                $_SESSION['firstname'] = $user['firstname'];
                $_SESSION['lastname'] = $user['lastname'];
                $_SESSION['role'] = $user['user_type'];
                $_SESSION['filter'] = $filterYear['year'];
                $_SESSION['filterAudit'] = "today";

                echo "<script>location.href='../admin/dashboard.php'</script>";
            } else {
                echo "<script>location.href='../index.php?error-login=Invalid Credentials, Please try again.'</script>";
            }
        } else {
            echo "<script>location.href='../index.php?error-login=Invalid Credentials, Please try again.'</script>";
        }

        $stmt->close();
    } else {
        echo "Error in database query";
    }
}


if (isset($_POST['mobile-login'])) {
    $username = $_POST['username'];
    $password = md5($_POST['password']);

    $query = "SELECT * FROM users WHERE username = ? AND password = ? AND user_type = 2 LIMIT 1";
    $stmt = $db->conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if ($user) {
                session_start();
                $filterYearQry = $db->conn->query("SELECT DISTINCT YEAR(date) as year FROM data ORDER BY year DESC LIMIT 1");
                $filterYear = mysqli_fetch_assoc($filterYearQry);
                $_SESSION['authenticated'] = true;
                $_SESSION['id'] = $user['id'];
                $_SESSION['firstname'] = $user['firstname'];
                $_SESSION['lastname'] = $user['lastname'];
                $_SESSION['role'] = $user['user_type'];
                $_SESSION['station_id'] = $user['assigned_station'];
                $_SESSION['filter'] = $filterYear['year'];

                echo "<script>location.href='../android/home.php'</script>";
            } else {
                echo "<script>location.href='../android/index.php?error-login=Invalid Credentials, Please try again.'</script>";
            }
        } else {
            echo "<script>location.href='../android/index.php?error-login=Invalid Credentials, Please try again.'</script>";
        }

        $stmt->close();
    } else {
        echo "Error in database query";
    }
}

if(isset($_POST['admin-logout'])){
    session_start();
    session_destroy();
    $_SESSION['authenticated'] = false;
    echo "<script>location.href='../index.php'</script>";
}

if(isset($_POST['mobile-logout'])){
    session_start();
    session_destroy();
    $_SESSION['authenticated'] = false;
    echo "<script>location.href='../android'</script>";
}

?>
