<?php

    // connection details for MySQL database
    $cd_host = "localhost";
    $cd_port = 3306;
    $cd_socket = "";
    $cd_dbname = "u446198991_companydirecto";
    $cd_user = "u446198991_AJPPeters";
    $cd_password = "Finbop2023";

    // Create connection
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
?>

