<?php

// Remove the next two lines for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

file_put_contents('debug.txt', print_r($_POST, true));
$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
    exit;
}   

if (!isset($_POST['id']) || !is_numeric($_POST['id']) ||
    !isset($_POST['locationID']) || !is_numeric($_POST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "invalid parameters";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 
    exit;
}

$departmentId = $_POST['id'];
$locationID = $_POST['locationID'];

$checkQuery = $conn->prepare("SELECT * FROM department WHERE id = ?");
$checkQuery->bind_param("i", $departmentId);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows == 0) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "No department with the given ID exists";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 
    exit;
}

$departmentName = $_POST['name'];
$stmt = $conn->prepare("UPDATE department SET name = ?, locationID = ? WHERE id = ?");
$stmt->bind_param("sii", $departmentName, $locationID, $departmentId);

if ($stmt->execute()) {
    // success
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = ['id' => $departmentId, 'locationID' => $locationID];
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

mysqli_close($conn);

echo json_encode($output); 

?>
