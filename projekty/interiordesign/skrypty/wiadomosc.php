<?php
if (!isset($_POST["imie"]) || !isset($_POST["email"]) || !isset($_POST["temat"]) || !isset($_POST["wiadomosc"])) {
	header("Location: /portfolio/interiordesign/kontakt.php");
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
$temat     = $_POST["temat"];
$wiadomosc = $_POST["wiadomosc"];
//Ustal datę
date_default_timezone_set("Europe/Warsaw");
$data = date("d.m.Y G:i", time());
//Zapisz treść wiadomości
//$to = "aga@roomy.pl";
$to2 = "kogepan@tlen.pl";
$subject = "$temat";
$msg = "$wiadomosc\n\nWysłano $data przez $imie z adresu: $email";
//Wyślij wiadomość
// @mail($to, $subject, $msg, "From: Formularz (nazwafirmy) <kontakt@nazwafirmy.pl>") or die(
// 	//Wyświetl informację o błędzie
// 	json_encode(array(
// 		"stan" => "error",
// 		"ikona" => "fa-times"
// 	))
// );
@mail($to2, $subject, $msg, "From: Formularz (nazwafirmy) <kontakt@nazwafirmy.pl>") or die(
	//Wyświetl informację o błędzie
	json_encode(array(
		"stan" => "error",
		"ikona" => "fa-times"
	))
);
echo json_encode(array(
	"stan" => "ok",
	"ikona" => "fa-check"
));
?>