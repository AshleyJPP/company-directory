<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

include 'config.php';


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $email = $_POST['email'];
    $department = $_POST['departmentId'];

    $stmt = $conn->prepare("UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentId = ? WHERE id = ?");

    
    $stmt->bind_param("sssssi", $firstName, $lastName, $jobTitle, $email, $department, $id);

    
    if ($stmt->execute()) {
        echo json_encode(array("statusCode"=>200));
    } 
    else {
        echo json_encode(array("statusCode"=>201, "error" => $stmt->error));
    }
    $stmt->close();
    $conn->close();
}
else {
    // Not a POST request
    echo json_encode(array("statusCode"=>202));
}
?>
