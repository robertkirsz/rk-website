<?php
/*
	Kod pobierający i wyświetlający wpisy z bazy danych
*/
require_once("dane_bazy.php"); //Dane logowania do bazy danych
//Jeśli wyświetlana jest podstrona...
if (isset($_GET["s"])) {
	$tytul_prosty = $_GET["s"];
	$query = "SELECT tresc FROM cms_strony WHERE tytul_prosty = '$tytul_prosty'";
//Jeśli wyświetlany jest pojedynczy wpis...
} else if (isset($_GET["p"])) {
	$tytul_prosty = $_GET["p"];
	$query = "SELECT * FROM cms_wpisy WHERE tytul_prosty = '$tytul_prosty'";
//Jeśli wyświetlana jest strona główna wpisów...
} else {
	$query = "SELECT * FROM cms_wpisy ORDER BY id DESC";
}

$result = $dbc->query($query) or die("Błąd przy wysyłaniu zapytania do bazy MySQL: " . $dbc->error);
//Wyświetl wpisy
$zawartosc = "";
while ($row = $result->fetch_array()) {
	//Jeśli wyświetlana jest podstrona...
	if (isset($_GET["s"])) {
		$zawartosc = "<div class=\"strona\">" . $row["tresc"] . "</div>";
	//Jeśli wyświetlana jest strona główna lub pojedyńczy wpis...
	} else {
	//Inny przycisk w zależności od tego czy wyświetlane są wszystkie wpisy czy tylko jeden
	$przycisk = isset($_GET["p"]) ? "<a href=\".\" class=\"strona_glowna\">Strona główna</a>" : "<a href=\"?p=" . $row["tytul_prosty"] . "\" class=\"przejdz\">Przejdź do wpisu</a>";
	$zawartosc .= <<<WPIS
		<div class="wpis"">
			<h1 class="tytul">{$row["tytul_pelny"]}</h1>
			<span class="data">{$row["data"]}</span>
			<p class="tresc">{$row["tresc"]}</p>
			$przycisk
		</div>
WPIS;
	}
}
echo $zawartosc;
?>