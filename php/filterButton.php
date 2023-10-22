<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("config.php");

$response = array();


if(isset($_GET['department']) || isset($_GET['location'])) {
    $departmentId = $_GET['department'];
    $locationId = $_GET['location'];

    $query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location 
              FROM personnel p 
              LEFT JOIN department d ON (d.id = p.departmentID) 
              LEFT JOIN location l ON (l.id = d.locationID) ";

    
    $params = array();
    $conditions = array();
    if (!empty($departmentId)) {
        $conditions[] = "d.id = ?";
        $params[] = $departmentId;
    }
    if (!empty($locationId)) {
        $conditions[] = "l.id = ?";
        $params[] = $locationId;
    }

    if (count($conditions) > 0) {
        $query .= "WHERE " . implode(" AND ", $conditions);
    }

    $query .= " ORDER BY p.lastName, p.firstName, d.name, l.name";

    if($stmt = $conn->prepare($query)) {
        if (count($params) > 0) {
            $stmt->bind_param(str_repeat("i", count($params)), ...$params);
        }
        if($stmt->execute()) {
            $result = $stmt->get_result();
            $data = array();
            while ($row = $result->fetch_assoc()) {
                array_push($data, $row);
            }
            $response["status"] = array(
                "code" => 200,
                "description" => "Query executed successfully."
            );
            $response["data"] = $data;
        } else {
            $response["status"] = array(
                "code" => 400,
                "description" => "An error occurred during query execution."
            );
        }
        $stmt->close();
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
