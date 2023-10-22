<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("config.php");

$response = array();


if(isset($_POST['id'])) {
    $locationId = $_POST['id'];

    $checkQuery = "SELECT COUNT(*) as departmentCount FROM department WHERE locationID = ?";

    if($stmt = $conn->prepare($checkQuery)) {
        $stmt->bind_param("i", $locationId);

        if($stmt->execute()) {
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();

            if($data['departmentCount'] > 0) {
                $response["status"] = array(
                    "code" => 400,
                    "description" => "You cannot remove the entry for location " . $locationId . " because it has " . $data['departmentCount'] . " departments assigned to it."
                );
            } else {
                
                $stmt->close(); 

               
                $deleteQuery = "DELETE FROM location WHERE id = ?";

                if($stmt = $conn->prepare($deleteQuery)) {
                    
                    $stmt->bind_param("i", $locationId);

                    
                    if($stmt->execute()) {
                        
                        $response["status"] = array(
                            "code" => 200,
                            "description" => "Location deleted successfully."
                        );
                    } else {
                        
                        $response["status"] = array(
                            "code" => 400,
                            "description" => "An error occurred during deletion."
                        );
                    }
                    $stmt->close();
                } else {
                    
                    $response["status"] = array(
                        "code" => 400,
                        "description" => "An error occurred during query preparation."
                    );
                }
            }
        } else {
            $response["status"] = array(
                "code" => 400,
                "description" => "An error occurred while checking departments."
            );
        }
    } else {
        $response["status"] = array(
            "code" => 400,
            "description" => "An error occurred during query preparation."
        );
    }
} else {
    $response["status"] = array(
        "code" => 400,
        "description" => "Invalid request. Required parameters not found."
    );
}


$conn->close();

echo json_encode($response);
?>
