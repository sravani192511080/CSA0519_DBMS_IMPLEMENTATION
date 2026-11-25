<?php
include 'config/db.php';

if (isset($_POST['submit'])) {
    $name = $_POST['patient_name'];
    $hospital = $_POST['hospital_name'];
    $group = $_POST['blood_group'];
    $units = (int)$_POST['units_requested'];

    $sql = "INSERT INTO blood_requests
    (patient_name, hospital_name, blood_group, units_requested)
    VALUES (?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssi", $name, $hospital, $group, $units);

    if (mysqli_stmt_execute($stmt)) {
        echo "Blood Request Submitted Successfully!";
    } else {
        echo "Error: " . mysqli_stmt_error($stmt);
    }

    mysqli_stmt_close($stmt);
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Blood Requests</title>
    
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Blood Request Form</h1>

<form method="POST">
    Patient Name:
    <input type="text" name="patient_name" required><br><br>

    Hospital Name:
    <input type="text" name="hospital_name"><br><br>

    Blood Group:
    <select name="blood_group">
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>AB+</option>
        <option>AB-</option>
        <option>O+</option>
        <option>O-</option>
    </select><br><br>

    Units Required:
    <input type="number" name="units_requested" min="1" required><br><br>

    <button type="submit" name="submit">Submit Request</button>
</form>

<br>
<a href="index.php">Back to Home</a>

</body>
</html>