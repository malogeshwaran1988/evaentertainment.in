<?php
require_once "Mail.php";
$to = "andrew000us@gmail.com";
$from = $_REQUEST['email'];
$name = $_REQUEST['name'];
$lastname = $_REQUEST['lastname'];
$message = $_REQUEST['message'];
$headers = "From: $from\r\n";
$subject = "Contact Form from Eva Entertainment";
$host = "md-64.webhostbox.net";
$port = "465";
$username = "info@evaentertainment.in";
$password = "-Wxu]*-ff%);";
$smtp = Mail::factory('smtp',
  array ('host' => $host,
    'port' => $port,
    'auth' => true,
    'username' => $username,
    'password' => $password));

$fields = array();
$fields{"name"} = "First name";
$fields{"lastname"} = "Last name";
$fields{"email"} = "Email";
$fields{"message"} = "Message";

$body = "Here is what was sent:\n\n"; 
foreach($fields as $a => $b){   
	$body .= sprintf("%20s:%s\r\n",$b,$_REQUEST[$a]);
}

$mail = $smtp->send($to, $headers, $body);
if (PEAR::isError($mail)) {
  echo("<p>" . $mail->getMessage() . "</p>");
 } else {
  echo("<p>Message successfully sent!</p>");
 }

?>