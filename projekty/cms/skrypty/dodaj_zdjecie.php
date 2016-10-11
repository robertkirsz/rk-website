<?php
if (
	(isset($_POST["tytul_zdjecia"]) && $_POST["tytul_zdjecia"] != '') &&
	(isset($_POST["opis_zdjecia"]) && $_POST["opis_zdjecia"] != '')
) {
	$tytul = $_POST["tytul_zdjecia"];
	$opis = $_POST["opis_zdjecia"];

	//Dodaj zdjęcie
	$temp = explode(".", $_FILES["zdjecie"]["name"]); //Rozdziela po kropce nazwę na tablicę array(0 => 'nazwa_pliku', 1 => 'jpg')
	$zdjecie = $tytul . "." . end($temp); //Nazwa prosta + podkreślenie + numer + kropka + rozszerzenie
	
	//Przenieś zdjęcia z nową nazwą
	move_uploaded_file($_FILES["zdjecie"]["tmp_name"], "../uploads/" . $zdjecie);

	require_once("dane_bazy.php");
	//Dodaj dane projektu do bazy
	$query = "INSERT INTO cms_zdjecia (tytul, opis, zdjecie) VALUES ('$tytul', '$opis', '$zdjecie')";
	//$result = $dbc->query($query) or die("Błąd przy dodawaniu projektu: " . $dbc->error);
	echo <<<END
		<div class="col-md-3">
			<div class="thumbnail">
				<img src="../uploads/$zdjecie" alt="$tytul">
				<div class="caption">
					<h3>$tytul</h3>
					<p>$opis</p>
					<p><a href="#" class="btn btn-primary" role="button">Usuń</a></p>
				</div>
			</div>
		</div>
END;
	//Zamknij połącznie z bazą
	//if (isset($result)) { $result->close(); }
	if (isset($dbc)) { $dbc->close(); }
} else {
	echo "Nie przesłano prawidłowych danych";
}
?>