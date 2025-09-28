<?php
// Connect to database
$conn = new mysqli("localhost", "root", "password", "lithiumrepublic");

// Handle order submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $product = $_POST['product'];
    $price = $_POST['price'];

    $sql = "INSERT INTO orders (customer_name, product, price)
            VALUES ('$name', '$product', '$price')";

    if ($conn->query($sql) === TRUE) {
        echo "Order placed successfully!";
    } else {
        echo "Error: " . $conn->error;
    }
}
?>
