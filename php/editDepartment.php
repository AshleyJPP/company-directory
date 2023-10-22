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
    !isset($_POST['name']) || !is_string($_POST['name']) ||
    !isset($_POST['locationID']) || !is_numeric($_POST['locationID'])) {
    
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "invalid parameters";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$id = $_POST['id'];
$name = $_POST['name'];
$locationID = $_POST['locationID'];


$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
$query->bind_param("sii", $name, $locationID, $id);
$query->execute();


$affectedRows = $query->affected_rows;

if ($affectedRows == -1) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed: " . $query->error;
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
} elseif ($affectedRows == 0) {
   
    $output['status']['code'] = "204";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "no changes were made"; 
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}


$selectQuery = $conn->prepare("SELECT * FROM department WHERE id = ?");
$selectQuery->bind_param("i", $id);
$selectQuery->execute();
$result = $selectQuery->get_result();

if ($result) {
    $data = $result->fetch_assoc(); 
    $output['data'] = $data; 
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output); 

?>
