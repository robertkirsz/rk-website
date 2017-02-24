<?php

if (!isset($_POST["name"]) || !isset($_POST["email"]) || !isset($_POST["message"])) {
	header("Location: /");
	die;
}

// Strip form data
foreach($_POST as $key => $value) {
	if (ini_get('magic_quotes_gpc')) { $_POST[$key] = stripslashes($_POST[$key]); }
	$_POST[$key] = htmlspecialchars(strip_tags($_POST[$key]));
}

// Gather data
$name    = $_POST["name"];
$email   = $_POST["email"];
$message = $_POST["message"];

// Save current date
date_default_timezone_set("Europe/Warsaw");
$data = date("d.m.Y G:i", time());

// Format the message
$to = "robert.kirsz@gmail.com";
$subject = "Message from $name";
$msg = "$message\n\nSent on $data by $name from: $email";

// Send message
@mail($to, $subject, $msg, "From: robertkirsz.pl <$email>") or die(

	// Show error message if needed
	json_encode(array(
		"status" => "error",
		"icon" => "<span class=\"glyphicon glyphicon-remove\">"
	))
);

// Show success message
echo json_encode(array(
	"status" => "ok",
	"icon" => "<span class=\"glyphicon glyphicon-ok\">"
));

?>
