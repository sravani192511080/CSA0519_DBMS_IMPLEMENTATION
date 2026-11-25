
<?php
include 'config/db.php';

$donors = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM donors"))['total'];

$groups = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM blood_inventory"))['total'];

$stock = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COALESCE(SUM(units_available),0) AS total FROM blood_inventory"))['total'];

$requests = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM blood_requests"))['total'];

$pending = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM blood_requests WHERE request_status='Pending'"))['total'];
?>

<!DOCTYPE html>
<html>
<head>
    <title>Blood Bank Management</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <h1>Blood Bank Inventory and Donor Management System</h1>

    <h2>Welcome to Blood Bank</h2>
    <p>Manage donors, blood stock and requests easily.</p>

    <h2>Dashboard</h2>

    <table>
        <tr>
            <th>Total Donors</th>
            <th>Blood Groups</th>
            <th>Available Units</th>
            <th>Total Requests</th>
            <th>Pending Requests</th>
        </tr>

        <tr>
            <td><?php echo $donors; ?></td>
            <td><?php echo $groups; ?></td>
            <td><?php echo $stock; ?></td>
            <td><?php echo $requests; ?></td>
            <td><?php echo $pending; ?></td>
        </tr>
    </table>

    <h2>Menu</h2>

    <a href="/BloodBank/donors.php">Add Donor</a><br><br>

    <a href="/BloodBank/donor_list.php">View Donors</a><br><br>

    <a href="/BloodBank/inventory.php">Blood Inventory</a><br><br>

    <a href="/BloodBank/requests.php">Submit Blood Request</a><br><br>

    <a href="/BloodBank/request_list.php">View Blood Requests</a><br><br>

    <a href="/BloodBank/issues.php">Issue Blood</a><br><br>

    <a href="/BloodBank/issue_list.php">Blood Issue History</a>

</body>
</html>
