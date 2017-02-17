<?php

if (!isset($_POST["imie"]) || !isset($_POST["email"]) || !isset($_POST["wiadomosc"])) {
	header("Location: /");
	die;
}

//Oczyść przesłane dane
foreach($_POST as $key => $value) {
	if (ini_get('magic_quotes_gpc')) { $_POST[$key] = stripslashes($_POST[$key]); }
	$_POST[$key] = htmlspecialchars(strip_tags($_POST[$key]));
}

//Zapisz zmienne
$imie      = $_POST["imie"];
$email     = $_POST["email"];
$wiadomosc = $_POST["wiadomosc"];

//Ustal datę
date_default_timezone_set("Europe/Warsaw");
$data = date("d.m.Y G:i", time());

//Zapisz treść wiadomości
$to = "robert.kirsz@gmail.com";
$subject = "Wiadomość od $imie";
$msg = "$wiadomosc\n\nWysłano $data przez $imie z adresu: $email";

//Wyślij wiadomość
@mail($to, $subject, $msg, "From: Formularz robertkirsz.pl <$email>") or die(

	//Wyświetl informację o błędzie
	json_encode(array(
		"stan" => "error",
		"ikona" => "<span class=\"glyphicon glyphicon-remove\">"
	))
);

echo json_encode(array(
	"stan" => "ok",
	"ikona" => "<span class=\"glyphicon glyphicon-ok\">"
));

?>
