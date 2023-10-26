<?php
include 'config.php';

$departmentId = $_POST['departmentId'];

$response = array();

try {
    $query = "SELECT COUNT(*) as count FROM personnel WHERE departmentid = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $departmentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $response['employeeCount'] = $row['count'];
    if ($row['count'] > 0) {
        $response['status'] = 'error';
        $response['message'] = 'There are ' . $row['count'] . ' personnel associated with this department. Cannot delete.';
    } else {
        $response['status'] = 'success';
        $response['message'] = 'No personnel associated with this department. Safe to delete.';
    }
} catch(Exception $e) {
    $response['status'] = 'error';
    $response['message'] = 'Server error: ' . $e->getMessage();
}

echo json_encode($response);
?>
