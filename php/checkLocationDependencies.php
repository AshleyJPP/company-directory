<?php
include 'config.php';

$locationId = $_POST['locationId'];
$response = array();

try {
    $query = "SELECT COUNT(d.id) as departmentCount, l.name as locationName 
              FROM location l
              LEFT JOIN department d ON d.locationID = l.id 
              WHERE l.id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $locationId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $response['departmentCount'] = $row['departmentCount'];
    $response['locationName'] = $row['locationName'];

    if ($row['departmentCount'] > 0) {
        $response['status'] = 'error';
        $response['message'] = 'You cannot remove ' . $row['locationName'] . ' as it has ' . $row['departmentCount'] . ' departments assigned to it.';
    } else {
        $response['status'] = 'success';
        $response['message'] = 'No departments associated with ' . $row['locationName'] . '. Safe to delete.';
    }

} catch(Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Server error: ' . $e->getMessage();
}

echo json_encode($response);
?>
