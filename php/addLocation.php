<?php
include("config.php");

$response = array();

if(isset($_POST['locationName'])) {
    $locationName = $_POST['locationName'];

    $query = "INSERT INTO location (name) VALUES (?)";

    if($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $locationName);

        if($stmt->execute()) {
            $last_id = $stmt->insert_id;

            $response["status"] = array(
                "code" => 200,
                "description" => "Location added successfully."
            );
            $response["data"] = array(
                "id" => $last_id,
                "name" => $locationName 
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
