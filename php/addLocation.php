<?php
    // Enable error reporting for debugging (disable in production)
    ini_set('display_errors', '1');
    error_reporting(E_ALL);

    if(isset($_POST['firstName']) && isset($_POST['lastName']) && isset($_POST['jobTitle']) && isset($_POST['email']) && isset($_POST['departmentID'])) {
        
        require_once("config.php");

        $stmt = $conn->prepare("INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)");
        
        if (false === $stmt) {
            die(json_encode(['status' => 'error', 'message' => 'Database prepare operation failed']));
        }

        $firstName = ucwords(strtolower(trim($_POST['firstName'])));
        $lastName = ucwords(strtolower(trim($_POST['lastName'])));
        $jobTitle = ucwords(strtolower(trim($_POST['jobTitle'])));
        $email = trim($_POST['email']);
        $departmentID = intval($_POST['departmentID']);

        $stmt->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);
        $result = $stmt->execute();

        if (false === $result) {
            die(json_encode(['status' => 'error', 'message' => 'Database execute operation failed']));
        }

        $newEmployeeId = $conn->insert_id;

        $stmt = $conn->prepare("SELECT p.*, d.name as departmentName, l.name as locationName FROM personnel p LEFT JOIN department d ON p.departmentID = d.id LEFT JOIN location l ON d.locationID = l.id WHERE p.id = ?");

        
        if (false === $stmt) {
            die(json_encode(['status' => 'error', 'message' => 'Database prepare operation failed']));
        }

        $stmt->bind_param("i", $newEmployeeId);
        $result = $stmt->execute();

        if (false === $result) {
            die(json_encode(['status' => 'error', 'message' => 'Database execute operation failed']));
        }

        $result = $stmt->get_result();
        $newEmployee = $result->fetch_assoc();

        echo json_encode(['status' => 'success', 'message' => 'Employee added successfully', 'employee' => $newEmployee]);

        $stmt->close();
        $conn->close();
    } else {
        die(json_encode(['status' => 'error', 'message' => 'Insufficient data provided']));
    }
?>
