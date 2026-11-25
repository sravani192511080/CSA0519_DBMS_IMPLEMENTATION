<?php
include 'config/db.php';

if (isset($_POST['issue'])) {
    $request_id = (int)$_POST['request_id'];
    $units = (int)$_POST['units'];

    mysqli_begin_transaction($conn);

    try {
        $stmt = mysqli_prepare($conn,
            "SELECT * FROM blood_requests
             WHERE request_id = ? FOR UPDATE");
        mysqli_stmt_bind_param($stmt, "i", $request_id);
        mysqli_stmt_execute($stmt);
        $request = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

        if (!$request || $request['request_status'] != 'Approved') {
            throw new Exception("Only approved requests can be issued.");
        }

        $stmt = mysqli_prepare($conn,
            "SELECT COALESCE(SUM(units_issued), 0) AS total
             FROM blood_issues WHERE request_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $request_id);
        mysqli_stmt_execute($stmt);
        $issued = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

        $remaining = $request['units_requested'] - $issued['total'];

        if ($units <= 0 || $units > $remaining) {
            throw new Exception("Invalid issue quantity.");
        }

        $group = $request['blood_group'];

        $stmt = mysqli_prepare($conn,
            "SELECT units_available FROM blood_inventory
             WHERE blood_group = ? FOR UPDATE");
        mysqli_stmt_bind_param($stmt, "s", $group);
        mysqli_stmt_execute($stmt);
        $stock = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

        if (!$stock || $stock['units_available'] < $units) {
            throw new Exception("Insufficient blood stock.");
        }

        $stmt = mysqli_prepare($conn,
            "INSERT INTO blood_issues (request_id, units_issued)
             VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, "ii", $request_id, $units);
        mysqli_stmt_execute($stmt);

        $stmt = mysqli_prepare($conn,
            "UPDATE blood_inventory
             SET units_available = units_available - ?
             WHERE blood_group = ?");
        mysqli_stmt_bind_param($stmt, "is", $units, $group);
        mysqli_stmt_execute($stmt);

        mysqli_commit($conn);
        echo "Blood Issued Successfully!";

    } catch (Exception $e) {
        mysqli_rollback($conn);
        echo $e->getMessage();
    }
}

$result = mysqli_query($conn,
    "SELECT * FROM blood_requests WHERE request_status = 'Approved'");
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
    <title>Blood Issue Management</title>
   
</head>
<body>
    <a href="/BloodBank/index.php">← Back to Home</a>
<br><br>

<h1>Blood Issue Management</h1>

<form method="POST">
    Approved Request:

    <select name="request_id" required>
        <?php while ($row = mysqli_fetch_assoc($result)) { ?>
            <option value="<?php echo $row['request_id']; ?>">
                <?php echo htmlspecialchars(
                    $row['patient_name'] . " - " .
                    $row['blood_group'] . " - Request #" .
                    $row['request_id']
                ); ?>
            </option>
        <?php } ?>
    </select>

    <br><br>

    Units to Issue:
    <input type="number" name="units" min="1" required>

    <br><br>

    <button type="submit" name="issue">Issue Blood</button>
</form>

<br>
<a href="index.php">Back to Home</a>

</body>
</html>