<?php
include("config.php"); // your database connection file

$response = array();

if(isset($_POST['locationName'])) {
    $locationName = $_POST['locationName'];

    $query = "INSERT INTO location (name) VALUES (?)"; // assuming your location table has a 'name' column

    if($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $locationName);

        if($stmt->execute()) {
            $last_id = $stmt->insert_id; // Get the ID of the newly inserted location

            $response["status"] = array(
                "code" => 200,
                "description" => "Location added successfully."
            );
            $response["data"] = array(
                "id" => $last_id, // Send the new location's ID
                "name" => $locationName // Send the new location's name
            );
        } else {
            $response["status"] = array(
                "code" => 400,
                "description" => "Failed to add location."
            );
        }
        $stmt->close();
    } else {
        $response["status"] = array(
            "code" => 400,
            "description" => "Failed to prepare statement."
        );
    }
} else {
    $response["status"] = array(
        "code" => 400,
        "description" => "Invalid request. Missing parameters."
    );
}

$conn->close();

echo json_encode($response);
?>
