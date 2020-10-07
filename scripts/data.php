<?php
// Need to set up a local web server to test this, using terminal command: php -S localhost:8000

$conn = mysqli_connect('SERVER_NAME', 'USERNAME', 'PASSWORD', 'DATABASE_NAME');

$result = mysqli_query($conn, "SELECT * FROM TABLE_NAME");

$data = array();
while ($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

echo json_encode($data);
?>
