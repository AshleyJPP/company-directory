<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("config.php");

$response = array();

// Check if the required data is present
if(isset($_POST['id'])) {
    $locationId = $_POST['id'];

    // First, check if there are any departments assigned to this location
    $checkQuery = "SELECT COUNT(*) as departmentCount FROM department WHERE locationID = ?"; // Adjust 'departments' and 'location_id' to your actual table and column names

    if($stmt = $conn->prepare($checkQuery)) {
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("i", $locationId); // "i" indicates the data type is integer

        // Execute the prepared statement
        if($stmt->execute()) {
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();

            if($data['departmentCount'] > 0) {
                // Departments are assigned to this location, so we cannot delete it
                $response["status"] = array(
                    "code" => 400,
                    "description" => "You cannot remove the entry for location " . $locationId . " because it has " . $data['departmentCount'] . " departments assigned to it."
                );
            } else {
                // No departments are assigned, so we can delete the location
                $stmt->close(); // Close the previous statement

                // Prepare a delete statement
                $deleteQuery = "DELETE FROM location WHERE id = ?"; // Adjusted to match your actual table and column names

                if($stmt = $conn->prepare($deleteQuery)) {
                    // Bind variables to the prepared statement as parameters
                    $stmt->bind_param("i", $locationId);

                    // Attempt to execute the prepared statement
                    if($stmt->execute()) {
                        // Record deleted successfully
                        $response["status"] = array(
                            "code" => 200,
                            "description" => "Location deleted successfully."
                        );
                    } else {
                        // Error occurred during deletion
                        $response["status"] = array(
                            "code" => 400,
                            "description" => "An error occurred during deletion."
                        );
                    }
                    $stmt->close();
                } else {
                    // Error occurred during statement preparation
                    $response["status"] = array(
                        "code" => 400,
                        "description" => "An error occurred during query preparation."
                    );
                }
            }
        } else {
            // Error occurred during execution
            $response["status"] = array(
                "code" => 400,
                "description" => "An error occurred while checking departments."
            );
        }
    } else {
        // Error occurred during statement preparation
        $response["status"] = array(
            "code" => 400,
            "description" => "An error occurred during query preparation."
        );
    }
} else {
    // Required data not available
    $response["status"] = array(
        "code" => 400,
        "description" => "Invalid request. Required parameters not found."
    );
}

// Close database connection
$conn->close();

// Echo JSON response
echo json_encode($response);
?>
