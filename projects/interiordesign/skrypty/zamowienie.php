<?php
if (!isset($_POST["imie"]) || !isset($_POST["email"]) || !isset($_POST["telefon"]) || !isset($_POST["zamowienie"])) {
	header("Location: /portfolio/interiordesign/wycena.php");
	die;
}
//Oczyść przesłane dane
// foreach($_POST as $key => $value) {
// 	if (ini_get('magic_quotes_gpc')) { $_POST[$key] = stripslashes($_POST[$key]); }
// 	$_POST[$key] = htmlspecialchars(strip_tags($_POST[$key]));
// }
//Zapisz zmienne
$imie       = $_POST["imie"];
$email      = $_POST["email"];
$telefon    = $_POST["telefon"];
$zamowienie = $_POST["zamowienie"];
//Ustal datę
date_default_timezone_set("Europe/Warsaw");
$data = date("d.m.Y G:i", time());
//Zapisz treść wiadomości
//$to = "aga@roomy.pl";
$to2 = "kogepan@tlen.pl";
$subject = "Zamówienie (nazwa firmy) od $imie";
$msg = "<p style='border: 1px solid; padding: 5px; margin-bottom: 10px; background: rgba(0,0,0,0.05);'>Imię i nazwisko: $imie<br>Email: $email<br>Telefon: $telefon<br>Data: $data</p>$zamowienie";
$headers = "From: Formularz (nazwa firmy) <kontakt@nazwafirmy.pl>\r\n";
$headers .= "Reply-To: ". strip_tags($_POST['email']) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
//Wyślij wiadomość
// @mail($to, $subject, $msg, "From: Formularz (nazwa firmy) <kontakt@nazwafirmy.pl>") or die(
// 	//Wyświetl informację o błędzie
// 	json_encode(array(
// 		"stan" => "error",
// 		"ikona" => "fa-times"
// 	))
// );
@mail($to2, $subject, $msg, $headers) or die(
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