<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
require_once 'config.php';


if (!isset($_POST['id'])) {
    die(json_encode(["error" => "Employee ID not provided"]));
}

$employeeID = $_POST['id'];

$stmt = $conn->prepare("DELETE FROM personnel WHERE id = ?");


$stmt->bind_param("i", $employeeID);


$result = $stmt->execute();


if (!$result) {
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
$output['data'] = [];

echo json_encode($output); 

?>
