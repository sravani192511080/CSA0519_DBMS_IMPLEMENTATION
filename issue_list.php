<?php
include 'config/db.php';

$sql = "SELECT blood_issues.*, blood_requests.patient_name,
        blood_requests.blood_group
        FROM blood_issues
        JOIN blood_requests
        ON blood_issues.request_id = blood_requests.request_id
        ORDER BY issue_id DESC";

$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Blood Issue History</title>
    
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Blood Issue History</h1>

<table border="1" cellpadding="10">
<tr>
    <th>Issue ID</th>
    <th>Request ID</th>
    <th>Patient Name</th>
    <th>Blood Group</th>
    <th>Units Issued</th>
    <th>Issue Date</th>
</tr>

<?php while ($row = mysqli_fetch_assoc($result)) { ?>
<tr>
    <td><?php echo $row['issue_id']; ?></td>
    <td><?php echo $row['request_id']; ?></td>
    <td><?php echo htmlspecialchars($row['patient_name']); ?></td>
    <td><?php echo htmlspecialchars($row['blood_group']); ?></td>
    <td><?php echo $row['units_issued']; ?></td>
    <td><?php echo $row['issue_date']; ?></td>
</tr>
<?php } ?>

</table>

<br>
<a href="issues.php">Issue More Blood</a>
<br><br>
<a href="index.php">Back to Home</a>

</body>
</html>