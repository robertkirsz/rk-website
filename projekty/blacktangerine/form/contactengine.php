<?php

$EmailFrom = "r.kirsz@black-t.pl";
$EmailTo = "r.kirsz@black-t.pl";
$Subject = "Wiadomość ze strony Black Tangerine";
$Imie = Trim(stripslashes($_POST['imie'])); 
$Nazwisko = Trim(stripslashes($_POST['nazwisko'])); 
$Email = Trim(stripslashes($_POST['email'])); 
$Wiadomosc = Trim(stripslashes($_POST['tresc'])); 

$validationOK=true;
if (!$validationOK) {
  print "<meta http-equiv=\"refresh\" content=\"0;URL=error.html\">";
  exit;
}

$Body = "";
$Body .= "Imię: ";
$Body .= $Imie;
$Body .= "\n";
$Body .= "Nazwisko: ";
$Body .= $Nazwisko;
$Body .= "\n";
$Body .= "Email: ";
$Body .= $Email;
$Body .= "\n";
$Body .= "Wiadomość: ";
$Body .= $Wiadomosc;
$Body .= "\n";

// $success = mail($EmailTo, $Subject, $Body, "Od: <$EmailFrom>");
$success = true;

if ($success){
  print "<meta http-equiv=\"refresh\" content=\"0;URL=ok.html\">";
}
else{
  print "<meta http-equiv=\"refresh\" content=\"0;URL=error.html\">";
}
?>