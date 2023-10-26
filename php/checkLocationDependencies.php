<?php
include 'config.php';

$locationId = $_POST['locationId'];

$response = array();

try {
    $query = "SELECT COUNT(*) as departmentCount FROM department WHERE locationID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $locationId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $response['departmentCount'] = $row['departmentCount'];

if ($row['departmentCount'] > 0) {
    $response['status'] = 'error';
    $response['message'] = 'You cannot remove this location as it has ' . $row['departmentCount'] . ' departments assigned to it.';
} else {
    $response['status'] = 'success';
    $response['message'] = 'No departments associated with this location. Safe to delete.';
}

} catch(Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Server error: ' . $e->getMessage();
}

echo json_encode($response);
?>
