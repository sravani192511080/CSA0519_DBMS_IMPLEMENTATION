<?php
include 'config/db.php';

if (isset($_GET['id']) && isset($_GET['status'])) {
    $id = (int)$_GET['id'];
    $status = $_GET['status'];

    if ($status == "Approved" || $status == "Rejected") {
        $sql = "UPDATE blood_requests SET request_status = ? WHERE request_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "si", $status, $id);

        if (mysqli_stmt_execute($stmt)) {
            header("Location: request_list.php");
            exit;
        }
    }
}

echo "Invalid request.";
?>