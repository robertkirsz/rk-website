<?php require_once("skrypty/naglowek.php"); ?>

<div id="main" class="kontakt">
	
	<?php require_once("skrypty/nawigacja.php"); ?>

	<section class="kontakt">
		<div class="content">

			<div class="info">
				<div class="adres">
					<span>kontakt:</span><br>
					<span>t.</span> 987 654 321 <small>godz. 10<sup>oo</sup>- 17<sup>oo</sup></small><br>
					<span>e.</span> <a href="#">kontakt@nazwafirmy.pl</a><br>
					<span>a.</span> Warszawa, Ulica 123A<br>
					<small>Prosimy o wcześniejsze uzgodnienie terminu wizyty telefonicznie lub mailowo.</small>
				</div>
				
				<div class="media">
					<span>media:</span><br>
					<span>www.</span>nazwafirmy.pl<br>
					<span>f.</span> <a href="#" target="_blank">facebook.com/nazwafirmy</a><br>
					<span>t.</span> <a href="#" target="_blank">nazwafirmy.tumblr.com</a><br>
					<span>i.</span> <a href="#" target="_blank">instagram.com/nazwafirmy</a><br>
					<span>p.</span> <a href="#" target="_blank">pinterest.com/nazwafirmy</a><br>
				</div>
				
			</div>

			<form name="wiadomosc" action="skrypty/wiadomosc.php" method="POST" accept-charset="utf-8">
				<legend>Formularz kontaktowy</legend>
					<ul>
						<li>
							<label for="imie">Imię</label>
							<input type="text" name="imie" required>
						</li>
						<li>
							<label for="email">Email</label>
							<input type="email" name="email" required>
						</li>
						<li>
							<label for="temat">Temat</label>
							<input type="text" name="temat" required>
						</li>
						<li>
							<label for="wiadomosc">Wiadomość</label>
							<textarea name="wiadomosc" required></textarea>
						</li>
						<li>
							<div class="submit">
								<input type="submit" value="">
								<span class="wyslij">Wyślij</span><i class="fa"></i>
							</div>
						</li>
					</ul>
			</form>

		</div>
	</section>

<?php require_once("skrypty/stopka.php"); ?>