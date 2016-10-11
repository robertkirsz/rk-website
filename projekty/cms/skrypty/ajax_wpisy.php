<?php
	//Poprzerabiać część powtarzajace się na funkcje
	session_start();
	//Jeśli użytkownik jest zalogowany...
	if (isset($_SESSION["login"])) {
		//Zabezpieczenie przed bezpośrednim wczytaniem strony
		if (isset($_REQUEST["element"]) && isset($_REQUEST["dzialanie"])) {
			require_once("../skrypty/dane_bazy.php"); //Dane logowania do bazy danych
			//Odczytaj rodzaj działania i element, na któym ma być wykonane
			$element = $_REQUEST["element"];
			$dzialanie = $_REQUEST["dzialanie"];
			//Funkcja zmieniająca format daty z rrrr-mm-dd na dd.mm.rrrr
			function formatDaty($data, $format = "") {
				if ($format == "us") {
					$dzien = substr($data, 0, 2);
					$miesiac = substr($data, 3, 2);
					$rok = substr($data, 6, 4);
					$nowa = "$rok/$miesiac/$dzien";
				} else {
					$dzien = substr($data, 8, 2);
					$miesiac = substr($data, 5, 2);
					$rok = substr($data, 0, 4);
					$nowa = "$dzien.$miesiac.$rok";
				}
				return $nowa;
			}
			//W zalezności od przekazanego działania...
			switch ($element) {
				case "wpis":
					switch ($dzialanie) {
						//Jeśli dodawany jest nowy wpis...
						case "dodaj":
							//Jeśli wszystkie pola formularza zostały wypełnione...
							if (!$_POST["tytul_pelny"] == "" && !$_POST["tytul_prosty"] == "" && !$_POST["data"] == "" && !$_POST["tresc"] == "") {
								//Pobierz przekazaną treść
								$tytul_pelny = $_POST["tytul_pelny"];
								$tytul_prosty = $_POST["tytul_prosty"];
								$data = formatDaty($_POST["data"], "us");
								$tresc = $_POST["tresc"];
								//Sprawdź czy taki wpis już istnieje w bazie
								$stmt = $dbc->prepare("SELECT * FROM cms_wpisy WHERE tytul_prosty = ?");
								$stmt->bind_param("s", $tytul_prosty);
								$stmt->execute();
								$result = $stmt->get_result();
								if (mysqli_num_rows($result) > 0) {
									die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Wpis o tej nazwie już istnieje (Error #1)"
									)));
								}
								//Zabezpieczenie przez SQL injection
								$stmt = $dbc->prepare("INSERT INTO cms_wpisy (tytul_pelny, tytul_prosty, data, tresc) VALUES (?, ?, ?, ?)");
								$stmt->bind_param("ssss", $tytul_pelny, $tytul_prosty, $data, $tresc);
								//Dodaj wpis
								$stmt->execute() or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy dodawaniu wpisu (Error #2)"
									))
								);
								//Pobierz ID dodanego przed chwilą wpisu
								$nowy_id = $dbc->insert_id;
								//Pobierz wszystkie wpisy
								$query = "SELECT id, tytul_pelny, data FROM cms_wpisy ORDER BY data DESC, id DESC;";
								$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy wysyłaniu zapytania do bazy MySQL (Error #3)"
									))
								);
								//Dodaj po kolei wpisy do zmiennej $calosc
								$calosc = "";
								while ($row = $result->fetch_array()) {
									$calosc .= '<tr class="wpis" data-id="'.$row["id"].'">' .
													'<td class="tytul_pelny">'.$row["tytul_pelny"].'</td>' .
													'<td class="data">'.formatDaty($row["data"]).'</td>' .
													'<td><div class="btn-group btn-group-xs">' .
													'<button class="edycja_wpisu btn btn-default">Edytuj</button>' .
													'<button class="usuniecie_wpisu btn btn-danger">Usuń</button></div></td>' .
												  '</tr>';
								}
								//Przekaż numer id nowego wpisu i odświeżoną listę przez JSON
								echo json_encode(array(
									"id" => $nowy_id,
									"zawartosc" => $calosc
								));
							//Jeśli jakieś pole formularza dodawania wpisu jest puste, wyświetl błąd
							} else {
								echo json_encode(array(
									"error" => true,
									"wiadomosc" => "Nie wszystkie pola formularza zostały wypełnione (Error #4)"
								));
							}
							break;
						//Jeśli rozpoczęto edycję wpisu...
						case "pobierz":
							//Pobierz przekazane id wpisu
							$id = $_GET["id"];
							//Na jego podstawie pobierz dane wpisu
							$query = "SELECT * FROM cms_wpisy WHERE id = $id";
							$result = $dbc->query($query) or die(json_encode(
								array(
									"error" => true,
									"wiadomosc" => "Błąd przy pobieraniu danych wpisu (Error #5)"
								))
							);
							$row = $result->fetch_array();
							//Przekaż dane wpisu przez JSON
							echo json_encode(array(
								"id"    => $row["id"],
								"tytul_pelny" => $row["tytul_pelny"],
								"tytul_prosty" => $row["tytul_prosty"],
								"data"  => formatDaty($row["data"]),
								"tresc" => $row["tresc"]
							));
							break;
						//Pobieranie listy tytułów do sprawdzania ich dostępności po stronie klienta
						case "sprawdz":
							$query = "SELECT tytul_prosty FROM cms_wpisy";
							$result = $dbc->query($query);
							$tytuly = [];
							while ($row = $result->fetch_array()) {
								$tytuly[] = $row["tytul_prosty"];
							}
							echo json_encode(array("tytuly" => $tytuly));
							break;
						//Jeśli zatwierdzono edycję wpisu...
						case "zapisz":
							//Pobierz przekazaną treść
							$id = $_POST["id"];
							$tytul_pelny = $_POST["tytul_pelny"];
							$tytul_prosty = $_POST["tytul_prosty"];
							$data = formatDaty($_POST["data"], "us");
							$tresc = $_POST["tresc"];
							//Sprawdź czy taki wpis już istnieje w bazie
							$stmt = $dbc->prepare("SELECT * FROM cms_wpisy WHERE tytul_prosty = ?");
							$stmt->bind_param("s", $tytul_prosty);
							$stmt->execute();
							$result = $stmt->get_result();
							while ($row = $result->fetch_array()) {
								if ($row["id"] != $id) {
									die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Ta nazwa jest już zajęta przez inny wpis (Error #6)"
									)));
								}
							}
							//Sprawdź czy wpis nie został usunięty przed zatwierdzeniem zmian
							$stmt = $dbc->prepare("SELECT * FROM cms_wpisy WHERE id = ?");
							$stmt->bind_param("i", $id);
							$stmt->execute();
							$result = $stmt->get_result();
							if (mysqli_num_rows($result) == 0) {
									die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Wpis nie istnieje w bazie, prawdopodobnie został z niej usunięty w czasie edycji (Error #7)"
									)));
								}
							//Aktualizuj dane wpisu
							$query = "UPDATE cms_wpisy SET tytul_pelny = '$tytul_pelny', tytul_prosty = '$tytul_prosty', data = '$data', tresc = '$tresc' WHERE id = $id";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy zapisywaniu zmian we wpisie (Error #8)"
									))
								);
							//Pobierz wszystkie wpisy z bazy danych
							$query = "SELECT id, tytul_pelny, data FROM cms_wpisy ORDER BY data DESC, id DESC;";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy wysyłaniu zapytania do bazy MySQL (Error #9)"
									))
								);
							//Dodaj po kolei wpisy do zmiennej $calosc
							$calosc = "";
							while ($row = $result->fetch_array()) {
								$calosc .= '<tr class="wpis" data-id="'.$row["id"].'">'.
												'<td class="tytul_pelny">'.$row["tytul_pelny"].'</td>'.
												'<td class="data">'.formatDaty($row["data"]).'</td>'.
												'<td><div class="btn-group btn-group-xs">' .
												'<button class="edycja_wpisu btn btn-default">Edytuj</button>' .
												'<button class="usuniecie_wpisu btn btn-danger">Usuń</button></div></td>' .
											'</tr>';
							}
							//Przekaż odświeżoną listę wpisów
							echo json_encode(array("tresc" => $calosc));
							break;
						//Jeśli usuwany jest wpis...
						case "usun":
							//Pobierz id wpisu
							$id = $_POST["id"];
							//Usuń odpowiedni wpis
							$query = "DELETE FROM cms_wpisy WHERE id = $id";
							$result = $dbc->query($query) or die("Błąd przy usuwaniu strony");
							break;
						default:
							echo json_encode(
								array(
									"error" => true,
									"wiadomosc" => "Nieprawidłowy rodzaj działania (Error #10)"
								)
							);
					}
					break;
				case "strona":
					switch ($dzialanie) {
						//Jeśli dodawana jest nowa strona...
						case "dodaj":
							//Jeśli wszystkie pola formularza zostały wypełnione...
							if (!$_POST["tytul_pelny"] == "" && !$_POST["tytul_prosty"] == "" && !$_POST["tresc"] == "") {
								//Pobierz przekazaną treść
								$tytul_pelny = $_POST["tytul_pelny"];
								$tytul_prosty  = $_POST["tytul_prosty"];
								$tresc = $_POST["tresc"];
								//Sprawdź czy taka strona już istnieje w bazie
								$stmt = $dbc->prepare("SELECT * FROM cms_strony WHERE tytul_prosty = ?");
								$stmt->bind_param("s", $tytul_prosty);
								$stmt->execute();
								$result = $stmt->get_result();
								if (mysqli_num_rows($result) > 0) {
									die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Strona o tej nazwie już istnieje (Error #11)"
									)));
								}
								//Zapisz ją w bazie
								$query = "INSERT INTO cms_strony (tytul_pelny, tytul_prosty, tresc) VALUES ('$tytul_pelny', '$tytul_prosty', '$tresc')";
								$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy dodawaniu strony (Error #12)"
									))
								);
								//Pobierz ID dodanej przed chwilą strony
								$nowy_id = $dbc->insert_id;
								$query = "SELECT id, tytul_pelny FROM cms_strony ORDER BY tytul_pelny ASC";
								$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy pobieraniu nowej strony (Error #13)"
									))
								);
								//Dodaj po kolei strony do zmiennej $calosc
								$calosc = "";
								while ($row = $result->fetch_array()) {
									$calosc .= '<tr class="strona" data-id="'.$row["id"].'">' .
													'<td class="tytul_pelny">'.$row["tytul_pelny"].'</td>' .
													'<td><div class="btn-group btn-group-xs">' .
													'<button class="edycja_strony btn btn-default">Edytuj</button>' .
													'<button class="usuniecie_strony btn btn-danger">Usuń</button></div></td>' .
												  '</tr>';
								}
								//Przekaż numer id nowej strony i odświeżoną listę przez JSON
								echo json_encode(array(
									"id" => $nowy_id,
									"zawartosc" => $calosc
								));
							//Jeśli jakieś pole formularza dodawania wpisu jest puste, wyświetl błąd
							} else {
								echo json_encode(array(
									"error" => true,
									"wiadomosc" => "Nie wszystkie pola formularza zostały wypełnione (Error #14)"
								));
							}
							break;
						//Jeśli rozpoczęto edycję strony...
						case "pobierz":
							//Pobierz przekazane id strony
							$id = $_GET["id"];
							//Na jego podstawie pobierz dane strony
							$query = "SELECT * FROM cms_strony WHERE id = $id";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy pobieraniu danych strony (Error #15)"
									))
								);
							$row = $result->fetch_array();
							//Przekaż dane wpisu przez JSON
							echo json_encode(array(
								"id"    => $row["id"],
								"tytul_pelny" => $row["tytul_pelny"],
								"tytul_prosty" => $row["tytul_prosty"],
								"tresc" => $row["tresc"]
							));
							break;
						//Pobieranie listy tytułów do sprawdzania ich dostępności po stronie klienta
						case "sprawdz":
							$query = "SELECT tytul_prosty FROM cms_strony";
							$result = $dbc->query($query);
							$tytuly = [];
							while ($row = $result->fetch_array()) {
								$tytuly[] = $row["tytul_prosty"];
							}
							echo json_encode(array("tytuly" => $tytuly));
							break;
						//Jeśli zatwierdzono edycję strony...
						case "zapisz":
							//Pobierz przekazaną treść
							$id    = $_POST["id"];
							$tytul_pelny = $_POST["tytul_pelny"];
							$tytul_prosty = $_POST["tytul_prosty"];
							$tresc = $_POST["tresc"];
							//Aktualizuj dane strony
							$query = "UPDATE cms_strony SET tytul_pelny = '$tytul_pelny', tytul_prosty = '$tytul_prosty', tresc = '$tresc' WHERE id = $id";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy edytowaniu strony (Error #16)"
									))
								);
							//Pobierz wszystkie strony z bazy danych
							$query = "SELECT id, tytul_pelny FROM cms_strony ORDER BY tytul_pelny ASC;";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy wysyłaniu zapytania do bazy MySQL (Error #17)"
									))
								);
							//Dodaj po kolei strony do zmiennej $calosc
							$calosc = "";
							while($row = $result->fetch_array()) {
								$id = $row["id"];
								$tytul_pelny = $row["tytul_pelny"];
								$calosc .= '<tr class="wpis" data-id="'.$row["id"].'">'.
												'<td class="tytul_pelny">'.$row["tytul_pelny"].'</td>'.
												'<td><div class="btn-group btn-group-xs">' .
												'<button class="edycja_strony btn btn-default">Edytuj</button>' .
												'<button class="usuniecie_strony btn btn-danger">Usuń</button></div></td>' .
											'</tr>';
							}
							//Przekaż odświeżoną listę wpisów
							echo $calosc;
							break;
						//Jeśli usuwana jest strona...
						case "usun":
							//Pobierz id strony
							$id = $_POST["id"];
							//Usuń odpowiednią stronę
							$query = "DELETE FROM cms_strony WHERE id = $id";
							$result = $dbc->query($query) or die(json_encode(
									array(
										"error" => true,
										"wiadomosc" => "Błąd przy usuwaniu wpisu (Error #18)"
									))
								);
							break;
						default:
							echo json_encode(
								array(
									"error" => true,
									"wiadomosc" => "Nieprawidłowy rodzaj działania (Error #19)"
								)
							);
					}
					break;
				default:
					echo json_encode(
						array(
							"error" => true,
							"wiadomosc" => "Nieprawidłowy element (Error #20)"
						)
					);
			}
			//Zamknij połączenie z bazą danych
			$result->close();
			$dbc->close();
		//Jeśli nie przesłano rodzaju elementu i działania w formularzu (wczytano stronę bezpośrednio)...
		} else {
			echo "Nie przesłano poprawnych danych z formularza";
		}
	//Jeśli użytkownik nie jest zalogowany...
	} else {
		echo "Strona wymaga zalogowania";
	}
?>