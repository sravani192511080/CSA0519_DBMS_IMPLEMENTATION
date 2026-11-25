
<?php
include 'config/db.php';

if (isset($_POST['save'])) {

    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $group = $_POST['blood_group'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $address = $_POST['address'];

    $sql = "INSERT INTO donors
    (donor_name, age, gender, blood_group, phone, email, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);

    mysqli_stmt_bind_param(
        $stmt, "sisssss",
        $name, $age, $gender, $group, $phone, $email, $address
    );

    if (mysqli_stmt_execute($stmt)) {
        echo "Donor Added Successfully!";
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
    <title>Donor Management</title>
   
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Donor Management</h1>

<form method="POST">

    Name:
    <input type="text" name="name" required><br><br>

    Age:
    <input type="number" name="age" required><br><br>

    Gender:
    <select name="gender" required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
    </select><br><br>

    Blood Group:
    <select name="blood_group" required>
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>O+</option>
        <option>O-</option>
        <option>AB+</option>
        <option>AB-</option>
    </select><br><br>

    Phone:
    <input type="text" name="phone" required><br><br>

    Email:
    <input type="email" name="email"><br><br>

    Address:
    <input type="text" name="address"><br><br>

    <button type="submit" name="save">Add Donor</button>

</form>

<br>
<a href="index.php">Back to Home</a>

</body>
</html>
