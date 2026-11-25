<?php
include 'config/db.php';

$result = mysqli_query($conn, "SELECT * FROM blood_requests ORDER BY request_id DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Blood Request List</title>
 
</head>
<body>
<a href="/BloodBank/index.php">← Back to Home</a>
<br><br>
<h1>Blood Requests</h1>

<table border="1" cellpadding="10">
<tr>
    <th>ID</th>
    <th>Patient Name</th>
    <th>Hospital</th>
    <th>Blood Group</th>
    <th>Units</th>
    <th>Date</th>
    <th>Status</th>
    <th>Action</th>
</tr>

<?php while ($row = mysqli_fetch_assoc($result)) { ?>
<tr>
    <td><?php echo $row['request_id']; ?></td>
    <td><?php echo htmlspecialchars($row['patient_name']); ?></td>
    <td><?php echo htmlspecialchars($row['hospital_name']); ?></td>
    <td><?php echo htmlspecialchars($row['blood_group']); ?></td>
    <td><?php echo $row['units_requested']; ?></td>
    <td><?php echo $row['request_date']; ?></td>
    <td><?php echo htmlspecialchars($row['request_status']); ?>
    <td>
    <a href="update_request.php?id=<?php echo $row['request_id']; ?>&status=Approved">Approve</a>
    |
    <a href="update_request.php?id=<?php echo $row['request_id']; ?>&status=Rejected">Reject</a>
</td>/td>
</tr>
<?php } ?>

</table>

<br>
<a href="requests.php">Add New Request</a>
<br><br>
<a href="index.php">Back to Home</a>

</body>
</html>