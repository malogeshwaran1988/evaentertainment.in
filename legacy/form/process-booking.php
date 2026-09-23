<?php

$to = "andrew000us@gmail.com";
$name = $_REQUEST['name'];
$lastname = $_REQUEST['lastname'];
$address = $_REQUEST['address'];
$phone = $_REQUEST['phone'];
$email = $_REQUEST['email'];
$service = $_REQUEST['service'];
$hours = $_REQUEST['hours'];
$date = $_REQUEST['date'];
$headers = "From: $email";
$subject = "Booking Form from Eva Entertainment";

$fields = array();
$fields{"name"} = "First Name";
$fields{"lastname"} = "Last Name";
$fields{"address"} = "Address";
$fields{"city"} = "City";
$fields{"phone"} = "Phone";
$fields{"email"} = "Email";
$fields{"service"} = "Service";
$fields{"hours"} = "Hours";
$fields{"date"} = "Date";

$body = "Here is what was sent:\n\n"; 
foreach($fields as $a => $b){   
	$body .= sprintf("%20s:%s\n",$b,$_REQUEST[$a]);
}
$send = mail($to, $subject, $body, $headers);

?>