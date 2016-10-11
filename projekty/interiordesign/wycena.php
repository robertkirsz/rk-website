<?php require_once("skrypty/naglowek.php"); ?>

<div id="regulamin"></div>

<div id="main" class="wycena">

  <?php require_once("skrypty/nawigacja.php"); ?>

  <section class="aplikacja">
    <div class="content">

      <div id="formularz_zamowienia">
        <form name="zamowienie" action="skrypty/zamowienie.php" method="POST" accept-charset="utf-8">
          <legend>Formularz zamówienia </legend>
            <ul>
              <li>
                <label>Imię i nazwisko</label>
                <input type="text" name="imie" required value="Testowski">
              </li>
              <li>
                <label>Email</label>
                <input type="email" name="email" required value="test@wp.pl">
              </li>
              <li>
                <label>Telefon</label>
                <input type="text" name="telefon" required value="987654321">
              </li>
              <li>
                <button class="powrot btn">Popraw<i class="fa fa-undo"></i></button>
                <button class="submit btn">
                  <input type="submit" value="">
                  Wyślij
                  <span class="icons">
                    <i class="fa custom-state fa-envelope-o"></i>
                    <i class="fa loading-state fa-circle-o-notch fa-spin"></i>
                    <i class="fa done-state fa-check"></i>
                  </span>
                </button>
              </li>
            </ul>
        </form>
      </div>
      <div class="pomieszczenie-wrap">
        <section class="wybierz_pomieszczenie">
          <h1>Wybierz pomieszczenie</h1>
          <ul>
            <li data-panel="salon">POKÓJ DZIENNY/SALON</li>
            <li data-panel="kuchnia">KUCHNIA</li>
            <li data-panel="jadalnia">JADALNIA</li>
            <li data-panel="lazienka">ŁAZIENKA/WC</li>
            <li data-panel="sypialnia">SYPIALNIA</li>
            <li data-panel="garderoba">GARDEROBA</li>
            <li data-panel="dzieciecy">POKÓJ DZIECIĘCY</li>
            <li data-panel="biuro">BIURO</li>
            <li data-panel="przedpokoj">PRZEDPOKÓJ</li>
            <li data-panel="inne">INNE</li>
          </ul>
        </section>

        <section class="listy clearfix">

          <section class="panel salon" data-cenabazowa="[30,40,50]">
            <h1>POKÓJ DZIENNY - SALON</h1>
            <div class="opcje">
              <legend>dodatkowe funkcje</legend>
              <ul>
                <li>aneks kuchenny (***)</li>
                <li class="clickable" data-cena="[20,30,50]">strefa jedzenia</li>
                <ul>
                  <li>stół + krzesła</li>
                  <li>stolik składany, ścienny</li>
                  <li>przedłużenie blatu + krzesła</li>
                  <li>barek + stołki barowe</li>
                  <li>preferuję krzesła składane</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable" data-cena="[10,20,30]">miejsce do pracy</li>
                <ul>
                  <li>szerokie biurko na komputer stacjonarny</li>
                  <li>biurko na komputer przenośny</li>
                  <li>niewielka przestrzeń do pracy/sekretarzyk</li>
                  <li>drukarka</li>
                  <li>dodatkowe miejsce na dokumenty</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable" data-cena="[10,20,30]">zaawansowane multimedia</li>
                <ul>
                  <li>Telewizor</li>
                  <li>Projektor</li>
                  <li>System głośników/Dolby Surround</li>
                  <li>Konsole</li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>meble</legend>
              <ul>
                <li class="clickable">wypoczynek</li>
                <ul>
                  <li>kanapa z funkcją spania</li>
                  <li>sofa nierozkładana</li>
                  <li>narożnik z funkcją spania</li>
                  <li>narożnik nierozkładany</li>
                  <li>pufa</li>
                  <li>fotel</li>
                  <li>szezlong/leżanka</li>
                  <li>hamak</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>stolik kawowy</li>
                <li class="clickable">miejsce do przechowywania</li>
                <ul>
                  <li>regał na książki/półki ścienne</li>
                  <li>szafki otwarte</li>
                  <li>szafki z drzwiami</li>
                  <li>witryna</li>
                  <li>kredens/bufet</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>dodatki</legend>
              <ul>
                <li>dywan</li>
                <li class="clickable">ozdoba okien</li>
                <ul>
                  <li>rolety</li>
                  <li>żaluzje</li>
                  <li>firany</li>
                  <li>zasłony</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel kuchnia" data-cenabazowa="[40,50,60]">
            <h1>KUCHNIA</h1>
            <div class="opcje">
              <legend>dodatkowe funkcje</legend>
              <ul>
                <li class="clickable" data-cena="[20,30,50]">strefa jedzenia</li>
                <ul>
                  <li>stół + krzesła</li>
                  <li>stolik składany, ścienny</li>
                  <li>przedłużenie blatu + krzesła</li>
                  <li>barek + stołki barowe</li>
                  <li>preferuję krzesła składane</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable" data-cena="[10,10,10]">spiżarnia</li>
                <ul>
                  <li>oddzielne pomieszczenie</li>
                  <li>spiżarnia w formie dużej szafki</li>
                  <li>spiżarnia cargo</li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>meble</legend>
              <ul>
                <li data-cena="[10,20,30]">wyspa kuchenna</li>
                <li class="clickable">dominujące wyposażenie wewnętrzne</li>
                <ul>
                  <li>systemy cargo (moduł na szynach)</li>
                  <li>półki</li>
                  <li>kosze wysuwane</li>
                  <li>szuflady</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">fronty</li>
                <ul>
                  <li>drewniane</li>
                  <li>wysoki połysk</li>
                  <li>matowe/zwykłe</li>
                  <li>stal nierdzewna</li>
                  <li>przeszklone</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">uchwyty</li>
                <ul>
                  <li>uchwyty odstające</li>
                  <li>system dotykowy - push to open</li>
                  <li>uchwyty frezowane</li>
                  <li>gałki</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">dodatkowe miejsce do przechowywania</li>
                <ul>
                  <li>regał/półki ścienne</li>
                  <li>wózek/ barek kuchenny</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>sprzęt AGD</legend>
              <ul>
                <li class="clickable">lodówka</li>
                <ul>
                  <li>wolnostojąca</li>
                  <li>zabudowana</li>
                  <li>wolnostojąca side by side</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">piekarnik</li>
                <ul>
                  <li>umieszczony standardowo pod blatem</li>
                  <li>umieszczony w wysokiej zabudowie</li>
                  <li>piekarnik z funkcją mikrofali</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">mikrofala</li>
                <ul>
                  <li>wolnostojąca</li>
                  <li>zabudowana</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">płyta kuchenna</li>
                <ul>
                  <li>indukcyjna</li>
                  <li>ceramiczna</li>
                  <li>gazowa</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">zmywarka</li>
                <ul>
                  <li>wolnostojąca 60cm</li>
                  <li>wolnostojąca 45cm</li>
                  <li>zabudowana 60cm</li>
                  <li>zabudowana 45cm</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">ekspres do kawy</li>
                <ul>
                  <li>wolnostojący</li>
                  <li>zabudowany</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">okap</li>
                <ul>
                  <li>montowany do ściany</li>
                  <li>okap sufitowy</li>
                  <li>zabudowany</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">zlewozmywak</li>
                <ul>
                  <li>1-komorowy</li>
                  <li>1,5-komorowy</li>
                  <li>2-komorowy</li>
                  <li>+ ociekacz</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>dodatki</legend>
              <ul>
                <li>półki otwarte/ścienne</li>
                <li>szyna/reling</li>
              </ul>
            </div>
          </section>

          <section class="panel jadalnia" data-cenabazowa="[0,0,0]">
            <h1>JADALNIA</h1>
            <div class="opcje">
              <legend>wyposażenie</legend>
              <ul>
                <li class="clickable">puste</li>
                <ul>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel lazienka" data-cenabazowa="[30,40,50]">
            <h1>ŁAZIENKA / WC</h1>
            <div class="opcje">
              <legend>wyposażenie</legend>
              <ul>
                <li class="clickable">wanna</li>
                <ul>
                  <li>prostokątna</li>
                  <li>narożna</li>
                  <li>owalna</li>
                  <li>na nóżkach</li>
                  <li>+ hydromasaż</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">prysznic</li>
                <ul>
                  <li>kabina prysznicowa narożna</li>
                  <li>kabina prysznicowa standard</li>
                  <li>typu walk-in</li>
                  <li>brodzik</li>
                  <li>odpływ podłogowy - bez brodzika</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">umywalka</li>
                <ul>
                  <li>klasyczna</li>
                  <li>meblowa</li>
                  <li>nablatowa</li>
                  <li>podwójna</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">miska WC</li>
                <ul>
                  <li>wisząca</li>
                  <li>stojąca</li>
                  <li>kompakt</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>bidet</li>
                <li class="clickable">pralka</li>
                <ul>
                  <li>standard 60x60cm</li>
                  <li>slim 60x40cm</li>
                  <li>ładowana od góry</li>
                  <li>pralko-suszarka</li>
                  <li>oddzielna suszarka</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>meble</legend>
              <ul>
                <li>zabudowa pralki</li>
                <li class="clickable">szafka pod umywalką</li>
                <ul>
                  <li>szafka otwierana</li>
                  <li>szuflady</li>
                  <li>otwarte półki</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>szafka wysoka/słupek</li>
                <li>szafki ścienne</li>
                <li>półki ścienne</li>
              </ul>
            </div>
            <div class="opcje">
              <legend>dodatki</legend>
              <ul>
                <li>akcesoria łazienkowe</li>
                <li>uchwyty/szyny na ręczniki</li>
                <li class="clickable">lustra</li>
                <ul>
                  <li>klejone do ściany</li>
                  <li>w ramie</li>
                  <li>szafka z lustrzanymi frontami</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel sypialnia" data-cenabazowa="[20,30,40]">
            <h1>SYPIALNIA</h1>
            <div class="opcje">
              <legend>dodatkowe funkcje</legend>
              <ul>
                <li>garderoba (***)</li>
              </ul>
            </div>
            <div class="opcje">
              <legend>meble</legend>
              <ul>
                <li>łóżko jednoosobowe</li>
                <li class="clickable">łóżko dwuosobowe</li>
                <ul>
                  <li>szerokość 140cm</li>
                  <li>szerokość 160cm</li>
                  <li>szerokość 180cm</li>
                  <li>szerokość 200cm</li>
                  <li>+ pojemnik</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">zagłówek</li>
                <ul>
                  <li>miękki</li>
                  <li>twardy</li>
                  <li>+ z miejscem do przechowywania</li>
                </ul>
                <li class="clickable">stolik nocny</li>
                <ul>
                  <li>po jednej stronie łóżka</li>
                  <li>po obu stronach łóżka</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>komoda</li>
                <li>toaletka</li>
                <li>szafki</li>
                <li>półki ścienne</li>
                <li class="clickable" data-cena="[10,20,30]">szafa</li>
                <ul>
                  <li>kombinacja z drzwiami z zawiasami</li>
                  <li>kombinacja z drzwiami przesuwnymi</li>
                  <li>kombinacja bez drzwi/otwarta/kotara</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">siedzisko</li>
                <ul>
                  <li>pufa</li>
                  <li>fotel</li>
                  <li>krzesło</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
            <div class="opcje">
              <legend>dodatki</legend>
              <ul>
                <li>dywan</li>
                <li>baldachim</li>
                <li>poduszki dekoracyjne/pled/narzuta</li>
                <li>przechowywanie pod łóżkiem</li>
                <li class="clickable">ozdoba okien</li>
                <ul>
                  <li>rolety</li>
                  <li>żaluzje</li>
                  <li>firany</li>
                  <li>zasłony</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">lustro</li>
                <ul>
                  <li>ścienne</li>
                  <li>stojące</li>
                  <li>w formie drzwi od szafy</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel garderoba" data-cenabazowa="[20,30,40]">
            <h1>GARDEROBA</h1>
            <div class="opcje">
              <legend>dodatkowe funkcje</legend>
              <ul>
                <li>garderoba otwarta</li>
                <li>garderoba z drzwiami z zawiasami</li>
                <li>garderoba z drzwiami z drzwiami przesuwnymi</li>
                <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                <li class="clickable">siedzisko</li>
                <ul>
                  <li>pufa</li>
                  <li>fotel</li>
                  <li>krzesło</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
              <legend>dodatki</legend>
              <ul>
                <li>dywan</li>
                <li class="clickable">lustro</li>
                <ul>
                  <li>ścienne</li>
                  <li>stojące</li>
                  <li>w formie drzwi od szafy</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel dzieciecy" data-cenabazowa="[0,0,0]">
            <h1>POKÓJ DZIECIĘCY</h1>
            <div class="opcje">
              <legend>wyposażenie</legend>
              <ul>
                <li class="clickable">puste</li>
                <ul>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel biuro" data-cenabazowa="[0,0,0]">
            <h1>BIURO</h1>
            <div class="opcje">
              <legend>wyposażenie</legend>
              <ul>
                <li class="clickable">puste</li>
                <ul>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel przedpokoj" data-cenabazowa="[20,30,40]">
            <h1>PRZEDPOKÓJ</h1>
            <div class="opcje">
              <legend>meble</legend>
              <ul>
                <li class="clickable" data-cena="[10,20,30]">szafa</li>
                <ul>
                  <li>kombinacja z drzwiami z zawiasami</li>
                  <li>kombinacja z drzwiami przesuwnymi</li>
                  <li>kombinacja bez drzwi/otwarta/kotara</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>komoda</li>
                <li>ławka</li>
                <li class="clickable">szafka na buty</li>
                <ul>
                  <li>z funkcją siedziska</li>
                  <li>wąska, przyścienna</li>
                  <li>+ z miejscem do przechowywania</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li class="clickable">przechowywanie ubrań wierzchnich</li>
                <ul>
                  <li>wieszak stojący</li>
                  <li>drążek na ubrania</li>
                  <li>haczyki</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
                <li>szafki</li>
                <li>półki ścienne</li>
                <li class="clickable">lustro</li>
                <ul>
                  <li>ścienne</li>
                  <li>stojące</li>
                  <li>w formie drzwi od szafy</li>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>

          <section class="panel inne" data-cenabazowa="[0,0,0]">
            <h1>INNE</h1>
            <div class="opcje">
              <legend>wyposażenie</legend>
              <ul>
                <li class="clickable">puste</li>
                <ul>
                  <li>nie mam zdania, zdaję się na <strong>ctrlHOME</strong></li>
                </ul>
              </ul>
            </div>
          </section>
        </section>

        <div class="pakiety">
          <div class="box mini">
            <h2><span>Pakiet Mini</span></h2>
            <div class="ikona">
              <svg class="domek mini">
                <path d="M 1 41 35 1 70 41 l 0 41 -70 0 z" class="border" />
                <rect width="70" height="27" x="0" y="55" class="fill" />
              </svg>
              <p><span class="cena">0</span> PLN</p>
            </div>
          </div>
          <div class="box midi">
            <h2><span>Pakiet Midi</span></h2>
            <div class="ikona">
              <svg class="domek midi">
                <path d="m 14 27 44 0 12 14 0 41 -70 0 0 -41 z" class="fill" />
                <path d="M 1 41 35 1 70 41 l 0 41 -70 0 z" class="border" />
              </svg>
              <p><span class="cena">0</span> PLN</p>
            </div>
          </div>
          <div class="box maxi">
            <h2><span>Pakiet Maxi</span></h2>
            <div class="ikona">
              <svg class="domek maxi">
                <path d="M 1 41 35 1 70 41 l 0 41 -70 0 z" class="border" />
              </svg>
              <p><span class="cena">0</span> PLN</p>
            </div>
          </div>
          <div class="box uwagi">
            <h2><span>Twoje uwagi</span></h2>
            <textarea placeholder="Tu wpisz wiadomość"></textarea>
          </div>
        </div>
      </div>
    </div>
  </section>


<?php require_once("skrypty/stopka.php"); ?>