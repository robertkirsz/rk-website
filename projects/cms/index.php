<?php
	session_start();
	require_once("wspolne/naglowek.php");
?>

<body id="strona_glowna">

<?php
	//Jeśli użytkownik nie jest zalogowany..
	if (isset($_SESSION["login"])) {
?>

	<!-- Pasek nawigacyjny -->
	<nav class="panel_sterowania navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand" href="#">System CMS</a>
				<button class="navbar-toggle" data-toggle="collapse" data-target=".navHeaderCollapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
			</div>
			<div class="collapse navbar-collapse navHeaderCollapse">
				<ul class="nav navbar-nav navbar-right">
					<li class="active"><a href="/cms/">Strona główna</a></li>
					<li><a href="panel">Panel administratorski</a></li>
					<li><a href="skrypty/wyloguj.php">Wyloguj</a></li>
				</ul>
			</div>
		</div>
	</nav>

<?php } ?>

	<main>
		<header>
			<h1>Logo</h1>
			<nav>
				<ul>
					<li><a href="" class="btn1">Strona główna</a></li>
					<?php
						require_once("skrypty/dane_bazy.php"); //Dane logowania do bazy danych
						$query = "SELECT tytul_pelny, tytul_prosty FROM cms_strony ORDER BY id ASC";
						$result = $dbc->query($query) or die("Błąd przy wysyłaniu zapytania do bazy MySQL: " . $dbc->error);
						//Wyświetl linki
						$strony = "";
						while ($row = $result->fetch_array()) {
							$strony .= '<li><a href="?s=' . $row["tytul_prosty"] . '" class="btn1" data="' . $row["tytul_prosty"] . '">' . $row["tytul_pelny"] . '</a></li>';
						}
						echo $strony;
					?>
				</ul>
			</nav>
		</header>
		<section>
			<div class="wpisy">
				<?php
					require_once("skrypty/pobierz_wpisy.php");
				?>
			</div>
			<aside>
				<ul>
					<?php echo $strony; ?>
				</ul>
			</aside>
		</section>
		<footer>Footer</footer>
	</main>

<?php
	require_once("wspolne/stopka.php");
?>