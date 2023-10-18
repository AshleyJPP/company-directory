<?php

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json');



require_once 'config.php';


if(isset($_POST['employeeID']) && isset($_POST['firstName']) && isset($_POST['lastName']) && isset($_POST['jobTitle']) && isset($_POST['emailAddress']) && isset($_POST['department'])) {

    
    $employeeID = $_POST['employeeID'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $jobTitle = $_POST['jobTitle'];
    $emailAddress = $_POST['emailAddress'];
    $department = $_POST['department'];

    
    $stmt = $conn->prepare("UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?");

    
    $stmt->bind_param("sssssi", $firstName, $lastName, $jobTitle, $emailAddress, $department, $employeeID);

    
    if($stmt->execute()) {
        // Success
        echo json_encode(array("statusCode"=>200));
    } else {
        
        echo json_encode(array("statusCode"=>201, "error"=>$stmt->error));
    }
    $stmt->close();
} else {
        echo json_encode(array("statusCode"=>400, "error"=>"Not all data was provided."));
}

// Close the database connection
$conn->close();
?>
