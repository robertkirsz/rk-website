<?php
	if (isset($_GET["login"]) && isset($_GET["haslo"])) {
		require_once("dane_bazy.php"); //Dane logowania do bazy danych
		//Pobierz wysłaną wartość "login"
		$login = $_GET["login"];
		//Wyszukaj uzytkownika w bazie dla podanego loginu
		$query = "SELECT * FROM cms_uzytkownicy WHERE login='$login'";
		$result = $dbc->query($query) or die("Błąd przy odszukiwaniu loginu: " . $dbc->error);
		//Pobierz zapisane hasło
		$row = $result->fetch_array();
		$zapisane_haslo = $row["haslo"];
		//Zamknij połaczenie z bazą danych
		$result->close();
		$dbc->close();
		//Pobierz wysłane hasło
		$haslo = $_GET["haslo"];
		//Zaszyfruj je
		$salt1 = "&yp*ui";
		$salt2 = "w@ki!z";
		$token = hash("ripemd128", "$salt1$haslo$salt2");
		//Porównaj wysłane hasło z hasłem pobranym z bazy
		//Jeśli hasła się zgadzają...
		if ($zapisane_haslo == $token) {
			//Rozpocznij sesję
			session_start();
			$_SESSION["login"] = $login;
			//Wyślij JSON
			echo json_encode(array("stan" => true));
		//Jeśli hasła nie są zgodne...
		} else {
			//Wyślij JSON
			echo json_encode(array("stan" => false));
		}
	} else {
		echo "Nie przesłano prawidłowych danych";
	}
?>