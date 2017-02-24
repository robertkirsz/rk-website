<?php
	session_start();
	require_once("../wspolne/naglowek.php"); //Nagłówek strony
	require_once('../skrypty/dane_bazy.php'); //Dane logowania do bazy danych
?>

<body id="panel_administracyjny">

	<noscript>Strona wymaga włączonego JavaScript</noscript>

	<?php
		//Jeśli użytkownik nie jest zalogowany..
		if (!isset($_SESSION["login"])) {
	?>

	<section class="panel_logowania">
		<!-- <img src="../images/logo.png" width="500" height="117" alt="Logo"> -->
		<form name="logowanie" action="../skrypty/logowanie.php" method="GET" accept-charset="utf-8">
			<ul class="cf">
				<li>
					<input type="text" name="login" placeholder="login" required>
				</li>
				<li>
					<input type="password" name="haslo" placeholder="hasło" required>
				</li>
				<li>
					<input type="submit" class="btn1" value="Zaloguj">
				</li>
			</ul>
		</form>
	</section>

	<a href="../" class="powrot" title="Powrót do strony głównej">
		<img src="../images/powrot.png" alt="Ikona powrotu do strony głównej">
	</a>

	<?php
		//Jeśli użytkownik jest zalogowany...
		} else {
	?>

	<!-- Modal -->
	<div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Zamknij</span></button>
					<h4 class="modal-title" id="myModalLabel">Wystąpił błąd</h4>
				</div>
				<div class="modal-body">
					Wystąpił błąd
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">Zamknij</button>
				</div>
			</div>
		</div>
	</div>

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
					<li><a href="../">Strona główna</a></li>
					<li class="active"><a href="#">Panel administratorski</a></li>
					<li><a href="../skrypty/wyloguj.php">Wyloguj</a></li>
				</ul>
			</div>
		</div>
	</nav>

	<!-- Główna część strony -->
	<div class="container">

		<!-- Nawigacja zakładek -->
		<ul class="nav nav-tabs">
			<li class="active"><a href="#panel_wpisy" role="tab" data-toggle="tab">Wpisy</a></li>
			<li><a href="#panel_strony" role="tab" data-toggle="tab">Strony</a></li>
			<li><a href="#panel_pliki" role="tab" data-toggle="tab">Pliki</a></li>
		</ul>

		<!-- Panele zakładek -->
		<div class="tab-content">
			<!-- Wpisy -->
			<div class="row tab-pane fade in active" id="panel_wpisy">
				<!-- Lista wpisów -->
				<div class="col-md-5">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Lista wpisów</h3>
						</div>
						<table class="lista_wpisow table table-condensed table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th>Tytuł</th>
								<th>Data</th>
								<th>Edycja</th>
							</tr>
						</thead>
						<tbody>
							<?php
								//Funkcja zmieniająca format daty z rrrr-mm-dd na dd.mm.rrrr
								function zmienFormat($data) {
									$dzien = substr($data, 8, 2);
									$miesiac = substr($data, 5, 2);
									$rok = substr($data, 0, 4);
									$nowa = "$dzien.$miesiac.$rok";
									return $nowa;
								}
								//Pobierz wszystkie wpisy z bazy danych
								$query = "SELECT id, tytul_pelny, data FROM cms_wpisy ORDER BY data DESC, id DESC;";
								$result = $dbc->query($query) or die('Błąd przy wysyłaniu zapytania do bazy MySQL: ' . $dbc->error);
								//Wyświetl wpisy na stronie
								$wpisy = "";
								while($row = $result->fetch_array()) {
									$wpisy .= '<tr class="wpis" data-id="' . $row["id"] . '">' .
												'<td class="tytul_pelny">' . $row["tytul_pelny"] . '</td>' .
												'<td class="data">' . zmienFormat($row["data"]) . '</td>' .
												'<td><div class="btn-group btn-group-xs">' .
												 '<button class="edycja_wpisu btn btn-default">Edytuj</button>' .
												 '<button class="usuniecie_wpisu btn btn-danger">Usuń</button></div></td>' .
											  '</tr>';
								}
								echo $wpisy;
							?>
						</tbody>
						</table>
					</div>	
				</div>
				<!-- Dodawanie/edycja wpisu -->
				<div class="col-md-7">
					<!-- Dodawanie wpisu -->
					<div class="panel_dodawanie_wpisu panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Nowy wpis</h3>
						</div>
						<div class="panel-body">
							<form class="form-horizontal" id="dodawanie_wpisu" method="POST" action="../skrypty/ajax_wpisy.php">
								<div class="form-group">
									<label for="dodawanie_wpisu_tytul_pelny" class="col-sm-3 control-label">Tytuł pełny:</label>
									<div class="col-sm-9">
										<input id="dodawanie_wpisu_tytul_pelny" class="form-control" name="tytul_pelny" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="dodawanie_wpisu_tytul_prosty" class="col-sm-3 control-label">Tytuł prosty:</label>
									<div class="col-sm-9">
										<input id="dodawanie_wpisu_tytul_prosty" class="form-control" name="tytul_prosty" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="dodawanie_wpisu_data" class="col-sm-3 control-label">Data:</label>
									<div class="col-sm-4">
										<input id="dodawanie_wpisu_data" class="form-control" name="data" type="text" value="<?php echo date('d.m.Y'); ?>" required>
									</div>
								</div>
								<div class="form-group">
									<label for="dodawanie_wpisu_tresc" class="col-sm-1 control-label">Treść:</label>
									<div class="col-sm-11">
										<textarea id="dodawanie_wpisu_tresc" name="tresc" class="form-control" rows="3" required></textarea>
									</div>
								</div>
								<input type="submit" class="btn btn-default" name="dodaj_wpis" value="Dodaj wpis">
							</form>
						</div>
					</div>
					<!-- Edycja wpisu -->
					<div class="panel_edycja_wpisu panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Edycja wpisu</h3>
						</div>
						<div class="panel-body">
							<form class="form-horizontal" id="edycja_wpisu" method="POST" action="../skrypty/ajax_wpisy.php">
								<div class="form-group">
									<label for="edycja_wpisu_tytul_pelny" class="col-sm-3 control-label">Tytuł pełny:</label>
									<div class="col-sm-9">
										<input id="edycja_wpisu_tytul_pelny" class="form-control" name="tytul_pelny" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="edycja_wpisu_tytul_prosty" class="col-sm-3 control-label">Tytuł prosty:</label>
									<div class="col-sm-9">
										<input id="edycja_wpisu_tytul_prosty" class="form-control" name="tytul_prosty" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="edycja_wpisu_data" class="col-sm-3 control-label">Data:</label>
									<div class="col-sm-3">
										<input id="edycja_wpisu_data" class="form-control" name="data" type="text" value="<?php echo date('Y-m-d'); ?>" required>
									</div>
								</div>
								<div class="form-group">
									<label for="edycja_wpisu_tresc" class="col-sm-1 control-label">Treść:</label>
									<div class="col-sm-11">
										<textarea id="edycja_wpisu_tresc" name="tresc" class="form-control" rows="3" required></textarea>
									</div>
								</div>
								<input type="hidden" name="id" value="">
								<input type="submit" class="btn btn-default" name="edytuj_wpis" value="Zapisz zmiany">
								<button class="anuluj btn btn-warning">Anuluj</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<!-- Strony -->
			<div class="row tab-pane fade" id="panel_strony">
				<!-- Lista stron -->
				<div class="col-md-5">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Lista stron</h3>
						</div>
						<table class="lista_stron table table-condensed table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th>Tytuł</th>
									<th>Edycja</th>
								</tr>
							</thead>
							<tbody>
								<?php
									//Pobierz wszystkie strony z bazy danych
									$query = "SELECT id, tytul_pelny FROM cms_strony ORDER BY tytul_pelny ASC;";
									$result = $dbc->query($query) or die('Błąd przy wysyłaniu zapytania do bazy MySQL: ' . $dbc->error);
									//Wyświetl wpisy na stronie
									$wpisy = "";
									while($row = $result->fetch_array()) {
										$wpisy .= '<tr class="strona" data-id="' . $row["id"] . '">' .
													'<td class="tytul_pelny">' . $row["tytul_pelny"] . '</td>' .
													'<td><div class="btn-group btn-group-xs">' .
													'<button class="edycja_strony btn btn-default">Edytuj</button>' .
													'<button class="usuniecie_strony btn btn-danger">Usuń</button></div></td>' .
												  '</tr>';
									}
									echo $wpisy;
								?>
							</tbody>
						</table>
					</div>
				</div>
				<!-- Dodawanie/edycja stron -->
				<div class="col-md-7">
					<!-- Dodawanie strony -->
					<div class="panel_dodawanie_strony panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Nowa strona</h3>
						</div>
						<div class="panel-body">
							<form class="form-horizontal" id="dodawanie_strony" method="POST" action="../skrypty/ajax_wpisy.php">
								<div class="form-group">
									<label for="dodawanie_strony_tytul_pelny" class="col-sm-3 control-label">Tytuł pełny:</label>
									<div class="col-sm-9">
										<input id="dodawanie_strony_tytul_pelny" class="form-control" name="tytul_pelny" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="dodawanie_strony_tytul_prosty" class="col-sm-3 control-label">Tytuł prosty:</label>
									<div class="col-sm-9">
										<input id="dodawanie_strony_tytul_prosty" class="form-control"  name="tytul_prosty" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="dodawanie_strony_tresc" class="col-sm-1 control-label">Treść:</label>
									<div class="col-sm-11">
										<textarea id="dodawanie_strony_tresc" name="tresc" class="form-control" rows="3" required></textarea>
									</div>
								</div>
								<input type="submit" class="btn btn-default" name="dodaj_strone" value="Dodaj stronę">
							</form>
						</div>
					</div>
					<!-- Edycja strony -->
					<div class="panel_edycja_strony panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Edycja strony</h3>
						</div>
						<div class="panel-body">
							<form class="form-horizontal" id="edycja_strony" method="POST" action="../skrypty/ajax_wpisy.php">
								<div class="form-group">
									<label for="edycja_strony_tytul_pelny" class="col-sm-3 control-label">Tytuł pełny:</label>
									<div class="col-sm-9">
										<input id="edycja_strony_tytul_pelny" class="form-control" name="tytul_pelny" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="edycja_strony_tytul_prosty" class="col-sm-3 control-label">Tytuł prosty:</label>
									<div class="col-sm-9">
										<input id="edycja_strony_tytul_prosty" class="form-control" name="tytul_prosty" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="edycja_strony_tresc" class="col-sm-1 control-label">Treść:</label>
									<div class="col-sm-11">
										<textarea id="edycja_strony_tresc" name="tresc" class="form-control" rows="3" required></textarea>
									</div>
								</div>
								<input type="hidden" name="id" value="">
								<input type="submit" class="btn btn-default" name="edytuj_strone" value="Zapisz zmiany">
								<button class="anuluj btn btn-warning">Anuluj</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<!-- Pliki -->
			<div class="row tab-pane fade" id="panel_pliki">
				<div class="col-md-3">
					<div class="panel panel-default">
						<div class="panel-heading">
							<h3 class="panel-title">Zdjęcia</h3>
						</div>
						<div class="panel-body">
							<form id="dodawanie_pliku" class="form-horizontal" action="skrypty/dodaj_zdjecie.php" method="POST" accept-charset="utf-8" enctype="multipart/form-data">
								<div class="form-group">
									<label for="tytul_zdjecia" class="col-sm-3 control-label">Tytuł:</label>
									<div class="col-sm-9">
										<input id="tytul_zdjecia" class="form-control" name="tytul_zdjecia" type="text" required>
									</div>
								</div>
								<div class="form-group">
									<label for="opis_zdjecia" class="col-sm-3 control-label">Opis:</label>
									<div class="col-sm-9">
										<input id="opis_zdjecia" class="form-control" name="opis_zdjecia" type="text" required>
									</div>
								</div>
								<div class="input-group">
									<span class="input-group-btn">
										<span class="btn btn-default btn-file">
											Plik <input type="file" name="zdjecie" required>
										</span>
									</span>
									<input type="text" class="pliki_info form-control" readonly>
								</div>
								<input type="submit" class="btn btn-default" value="Dodaj">
							</form>
						</div>
					</div>
				</div>
				<div class="col-md-9">
					<div class="row lista_plikow">
					<?php
						$query = "SELECT * FROM cms_zdjecia ORDER BY id DESC";
						$result = $dbc->query($query) or die("Błąd przy pobieraniu zdjęć: " . $dbc->error);
						$zdjecia = "";
						while($row = $result->fetch_array()) {
							$zdjecia .= <<<END
								<div class="col-md-3">
									<div class="thumbnail">
										<img src="../uploads/{$row["zdjecie"]}" alt="{$row["tytul"]}">
										<div class="caption">
											<h3>{$row["tytul"]}</h3>
											<p>{$row["opis"]}</p>
											<p><a href="#" class="usun_zdjecie btn btn-primary" role="button">Usuń</a></p>
										</div>
									</div>
								</div>
END;
						}
						echo $zdjecia;
					?>
					</div>
				</div>
			</div>
		</div>

	</div>

	<?php
		}
		require_once("../wspolne/stopka.php");
	?>