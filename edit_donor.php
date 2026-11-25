
<?php
include 'config/db.php';

$id = (int)($_GET['id'] ?? 0);

$stmt = mysqli_prepare($conn, "SELECT * FROM donors WHERE donor_id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$donor = mysqli_fetch_assoc($result);

if (!$donor) {
    die("Donor not found!");
}

if (isset($_POST['update'])) {
    $name = $_POST['name'];
    $age = (int)$_POST['age'];
    $gender = $_POST['gender'];
    $group = $_POST['blood_group'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $address = $_POST['address'];

    $stmt = mysqli_prepare($conn,
        "UPDATE donors SET donor_name=?, age=?, gender=?,
        blood_group=?, phone=?, email=?, address=?
        WHERE donor_id=?");

    mysqli_stmt_bind_param($stmt, "sisssssi",
        $name, $age, $gender, $group, $phone, $email, $address, $id);

    if (mysqli_stmt_execute($stmt)) {
        header("Location: donor_list.php");
        exit;
    } else {
        echo "Update failed: " . mysqli_stmt_error($stmt);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Edit Donor</title>
    
</head>
<body>

<h1>Edit Donor</h1>

<form method="POST">
    Name:
    <input type="text" name="name"
    value="<?php echo htmlspecialchars($donor['donor_name']); ?>" required><br><br>

    Age:
    <input type="number" name="age"
    value="<?php echo $donor['age']; ?>" required><br><br>

    Gender:
    <select name="gender">
        <?php foreach (['Male','Female','Other'] as $g) { ?>
        <option value="<?php echo $g; ?>"
        <?php if ($donor['gender'] == $g) echo 'selected'; ?>>
        <?php echo $g; ?>
        </option>
        <?php } ?>
    </select><br><br>

    Blood Group:
    <select name="blood_group">
        <?php foreach (['A+','A-','B+','B-','O+','O-','AB+','AB-'] as $g) { ?>
        <option value="<?php echo $g; ?>"
        <?php if ($donor['blood_group'] == $g) echo 'selected'; ?>>
        <?php echo $g; ?>
        </option>
        <?php } ?>
    </select><br><br>

    Phone:
    <input type="text" name="phone"
    value="<?php echo htmlspecialchars($donor['phone']); ?>" required><br><br>

    Email:
    <input type="email" name="email"
    value="<?php echo htmlspecialchars($donor['email']); ?>"><br><br>

    Address:
    <input type="text" name="address"
    value="<?php echo htmlspecialchars($donor['address']); ?>"><br><br>

    <button type="submit" name="update">Update Donor</button>
</form>

<br>
<a href="donor_list.php">Back to Donor List</a>

</body>
</html>
