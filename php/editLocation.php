<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// editLocation.php
include("config.php"); // Your database configuration

// Check if the necessary data is available
if (isset($_POST['id']) && isset($_POST['name'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];

    // Create a connection to the database
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname); // Replace with your db info

    // Check the connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare the SQL query
    $stmt = $conn->prepare("UPDATE location SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $name, $id);

    // Execute the query and respond accordingly
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Location updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error updating location"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
?>
