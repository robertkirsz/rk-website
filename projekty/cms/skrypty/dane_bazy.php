<?php
	//Dane logowania do bazy
	define("DB_HOST", "localhost");
	define("DB_BAZA", "robert87_baza87");
	define("DB_LOGIN", "robert87_admin87");
	define("DB_HASLO", "supertajne1987");
	// define("DB_HOST", "localhost");
	// define("DB_BAZA", "cms");
	// define("DB_LOGIN", "root");
	// define("DB_HASLO", "");
	//Nawiąż połączenie z bazą
	$dbc = new mysqli(DB_HOST, DB_LOGIN, DB_HASLO, DB_BAZA);
	if ($dbc->connect_error) die('Błąd przy połączeniu z serwerem MySQL: ' . $dbc->connect_error);
	//Ustaw kodowanie znaków na UTF-8
	$result = $dbc->query("SET NAMES utf8") or die('Błąd przy kodowaniu znaków: ' . $dbc->error);
?>