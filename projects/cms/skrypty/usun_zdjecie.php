<?php
if (isset($_GET["nazwa"])) {
	$nazwa_prosta = $_GET["nazwa"];
	require_once("dane_bazy.php");
	//Pobierz ścieżki do zdjęć
	$query = "SELECT nazwy_zdjec FROM roomy_projekty WHERE nazwa_prosta = '$nazwa_prosta'";
	$result = $dbc->query($query) or die("Błąd przy pobieraniu ścieżek zdjęć: " . $dbc->error);
	$row = $result->fetch_array();
	//Odczytaj je z zserializowanej tablicy
	$nazwy_zdjec = unserialize($row["nazwy_zdjec"]);
	//Usuń wszystkie zdjęcia zapisane w tablicy
	foreach ($nazwy_zdjec as $key => $value) {
		if (file_exists("../images/projekty/$value")) {
			unlink("../images/projekty/$value");
		}
	}
	//Usuń projekt z bazy danych
	$query = "DELETE FROM roomy_projekty WHERE nazwa_prosta = '$nazwa_prosta'";
	$result = $dbc->query($query) or die("Błąd przy usuwaniu projektu");
	//Przekaż JSON
	echo json_encode(array("usunieto" => true));
	//Zamknij połącznie
	$dbc->close();
} else {
	echo "Nie przesłano prawidłowych danych";
}
?>