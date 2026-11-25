
<?php
include 'config/db.php';
if (isset($_POST['add_stock'])) {
    $group = $_POST['blood_group'];
    $units = (int)$_POST['units'];

    $sql = "UPDATE blood_inventory
            SET units_available = units_available + ?
            WHERE blood_group = ?";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "is", $units, $group);

    if (mysqli_stmt_execute($stmt)) {
        echo "Blood Stock Added Successfully!";
    } else {
        echo "Error: " . mysqli_error($conn);
    }

    mysqli_stmt_close($stmt);
}

$sql = "SELECT * FROM blood_inventory ORDER BY blood_group";
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Blood Inventory</title>
  
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Blood Inventory Management</h1>
<h2>Add Blood Stock</h2>

<form method="POST">
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
    </select>

    <br><br>

    Units:
    <input type="number" name="units" min="1" required>

    <br><br>

    <button type="submit" name="add_stock">Add Stock</button>
</form>
<table border="1" cellpadding="10">
<tr>
    <th>ID</th>
    <th>Blood Group</th>
    <th>Units Available</th>
    <th>Last Updated</th>
</tr>

<?php while ($row = mysqli_fetch_assoc($result)) { ?>
<tr>
    <td><?php echo $row['inventory_id']; ?></td>
    <td><?php echo htmlspecialchars($row['blood_group']); ?></td>
    <td><?php echo $row['units_available']; ?></td>
    <td><?php echo $row['last_updated']; ?></td>
</tr>
<?php } ?>

</table>

<br>
<a href="index.php">Back to Home</a>

</body>
</html>
