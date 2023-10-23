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

if (!isset($_POST['name']) || !is_string($_POST['name']) ||
    !isset($_POST['locationID']) || !is_numeric($_POST['locationID'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "invalid parameters";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$name = $_POST['name'];
$locationID = $_POST['locationID'];

// Check if a department with the same name already exists
$checkQuery = $conn->prepare("SELECT * FROM department WHERE name = ?");
$checkQuery->bind_param("s", $name);
$checkQuery->execute();
$checkResult = $checkQuery->get_result();

if ($checkResult->num_rows > 0) {
    // A department with the same name already exists
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "A department with the same name already exists";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

// Prepare an INSERT statement
$stmt = $conn->prepare("INSERT INTO department (name, locationID) VALUES (?, ?)");
$stmt->bind_param("si", $name, $locationID);

if ($stmt->execute()) {
    // success
    $newId = $conn->insert_id; // Get the new ID assigned by the database

    // New query to get the location name from the location table
    $locationQuery = $conn->prepare("SELECT name FROM location WHERE id = ?");
    $locationQuery->bind_param("i", $locationID);
    $locationQuery->execute();
    $locationResult = $locationQuery->get_result();
    $locationName = '';
    if ($locationData = $locationResult->fetch_assoc()) {
        $locationName = $locationData['name'];
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    // Include location name in the response
    $output['data'] = ['id' => $newId, 'name' => $name, 'locationID' => $locationID, 'locationName' => $locationName]; // Return new department data
} else {
    // handle error
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

mysqli_close($conn);

echo json_encode($output); 

?>
