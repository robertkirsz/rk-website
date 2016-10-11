<?php
	//Usuń cookie
	//setcookie("admin", "", time() - 3600, "/");
	//Przenieś do strony z formularzem logowania
	session_start();
	$_SESSION = array();
	setcookie(session_name(), '', time() - 36000, '/');
	session_destroy();
	header("Location: /portfolio/cms/");
?>