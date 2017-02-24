<!DOCTYPE html>
<html lang="pl">
<head>
	<meta charset="utf-8">
	<title>Skrypt dodawania użytkowników</title>
</head>
<body>
<?php
	require_once("dane_bazy.php"); //Dane logowania do bazy danych
	if (isset($_POST["nazwa"]) && isset($_POST["haslo"])) {	
		$query = "CREATE TABLE IF NOT EXISTS cms_uzytkownicy (
			login VARCHAR(32) NOT NULL UNIQUE,
			haslo VARCHAR(32) NOT NULL)";
		$result = $dbc->query($query) or die("Błąd przy tworzeniu tabeli");
		
		$nazwa = $_POST["nazwa"];
		$salt1 = "&yp*ui";
		$salt2 = "w@ki!z";
		$haslo = $_POST["haslo"];
		$token = hash("ripemd128", "$salt1$haslo$salt2");

		$query  = "INSERT INTO uzytkownicy VALUES('$nazwa', '$token')";
		$result = $dbc->query($query) or die("Podany login już istnieje");

		$result->close();
		$dbc->close();

		echo "<p>Dodano użytkownika <strong>$nazwa</strong></p>";
	}
?>

<form id="dodawanie_uzytkownikow" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>" accept-charset="utf-8">
	<input type="text" name="nazwa" placeholder="Nazwa użytkownika" required>
	<!-- <input type="password" name="haslo" placeholder="Hasło (min. 6 znaków)" pattern="^.{6,}$" required> -->
	<input type="password" name="haslo" placeholder="Hasło" required>
	<input type="submit" value="Dodaj użytkownika">
</form>

</body>
</html>