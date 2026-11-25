
<?php
include 'config/db.php';

$result = mysqli_query($conn, "SELECT * FROM donors ORDER BY donor_id DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Registered Donors</title>
   
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Registered Donors</h1>

<a href="donors.php">Add New Donor</a>
<br><br>

<table border="1" cellpadding="10">
<tr>
    <th>ID</th>
    <th>Name</th>
    <th>Age</th>
    <th>Gender</th>
    <th>Blood Group</th>
    <th>Phone</th>
    <th>Email</th>
    <th>Address</th>
    <th>Actions</th>
</tr>

<?php while ($row = mysqli_fetch_assoc($result)) { ?>
<tr>
    <td><?php echo $row['donor_id']; ?></td>
    <td><?php echo htmlspecialchars($row['donor_name']); ?></td>
    <td><?php echo $row['age']; ?></td>
    <td><?php echo htmlspecialchars($row['gender']); ?></td>
    <td><?php echo htmlspecialchars($row['blood_group']); ?></td>
    <td><?php echo htmlspecialchars($row['phone']); ?></td>
    <td><?php echo htmlspecialchars($row['email']); ?></td>
    <td><?php echo htmlspecialchars($row['address']); ?></td>

    <td>
        <a href="edit_donor.php?id=<?php echo $row['donor_id']; ?>">Edit</a>
        |
        <a href="delete_donor.php?id=<?php echo $row['donor_id']; ?>">Delete</a>
    </td>
</tr>
<?php } ?>

</table>

<br>
<a href="index.php">Back to Home</a>

</body>
</html>
