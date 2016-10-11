<!doctype html>
<html class="no-js" lang="pl">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Robert Kirsz</title>
        <meta name="description" content="Robert Kirsz Front End Developer Portfolio">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="favicon.ico" type="image/x-icon">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="css/main.css">
        <!-- TEMPORARY -->
        <script src="http://localhost:35729/livereload.js"></script>
    </head>
    <body>

        <!-- NAVBAR -->
        <nav id="main_nav" class="navbar navbar-default navbar-static-top rk">
          <div class="container rk">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse-1">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="#main_cover">&lt;robertkirsz&frasl;&gt;</a>
            </div>
            <div class="collapse navbar-collapse" id="collapse-1">
              <ul class="nav navbar-nav navbar-right">
                <li><a href="#main_portfolio">&lt;portfolio&gt;</a></li>
                <li><a href="#main_skills">&lt;skills&gt;</a></li>
                <li><a href="#main_contact">&lt;kontakt&gt;</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- COVER -->
        <div id="main_cover" class="rk">
            <!-- <img src="img/coding.jpg" alt=""> -->
            <div class="info">
                <h1 class="rk">Front end developer szuka pracy</h1>
                <p class="rk">Bez doświadczenia zawodowego, ale z zapałem i chęcią do pracy.<br>Czy mu się uda? To w dużej mierze zależy od Ciebie</p>
            </div>
        </div>

        <!-- PORTFOLIO -->
        <div id="main_portfolio" class="rk">
            <h2 class="tag rk">&lt;portfolio&gt;</h2>
            <div class="container">
                <?php
                    $string = file_get_contents("xml/portfolio.json");
                    $json = json_decode($string, true);

                    foreach ($json as $key => $value) {

                        $nazwa = $value["nazwa"];
                        $adres = $value["adres"];
                        $opis = $value["opis"];
                        $desktop = $value["screenshot"]["desktop"];
                        $mobile = $value["screenshot"]["mobile"];
                        $responsywnosc = $value["responsywnosc"];

                        //Jeśli dostępna jest tylko wersja mobilna...
                        //Jeśli projekt jest responsywny...
                            if ($key % 2 == 0) {
                                if ($desktop == '') {
                                    $uklad = "mobile_only left";
                                } else {
                                    $uklad = "responsive left";
                                }
                                $bootstrap1 = "col-md-push-8";
                                $bootstrap2 = "col-md-pull-4";
                            } else {
                                if ($desktop == '') {
                                    $uklad = "mobile_only right";
                                } else {
                                    $uklad = "responsive right";
                                }
                                $bootstrap1 = "";
                                $bootstrap2 = "";
                            }

                        echo
                            '<div class="row portfolio-item '.$uklad.'">

                                <div class="description col-md-4 '.$bootstrap1.'">
                                    <h1>'.$nazwa.'</h1>
                                    <h3 class="responsive-icons">
                                        <i class="fa fa-desktop '.$responsywnosc["desktop"].'"></i>
                                        <i class="fa fa-tablet '.$responsywnosc["tablet"].'"></i>
                                        <i class="fa fa-mobile '.$responsywnosc["mobile"].'"></i>
                                    </h3>
                                    <p>'.$opis.'</p>
                                    <a href="http://'.$adres.'" type="button" class="btn btn-info">Zobacz projekt na żywo</a>
                                </div>

                                <div class="browsers col-md-8 '.$bootstrap2.'">';
                        
                                   if ($desktop != '') {   
                                        echo
                                            '<div class="desktop">
                                                <div class="top">
                                                    <i class="fa fa-arrow-left"></i>
                                                    <i class="fa fa-arrow-right"></i>
                                                    <i class="fa fa-refresh"></i>
                                                    <i class="fa fa-home"></i>
                                                    <div class="address">
                                                        <a href="http://'.$adres.'">'.$adres.'</a>
                                                    </div>
                                                </div>
                                                <div class="screen">
                                                    <img src="img/portfolio/'.$desktop.'" alt="'.$nazwa.' Desktop Version">
                                                </div>
                                            </div>';
                                    }

                                    if ($mobile != '') {
                                        echo 
                                            '<div class="phone">
                                                <div class="top"></div>
                                                <div class="screen">
                                                    <img src="img/portfolio/'.$mobile.'" alt="'.$nazwa.' Mobile Version">
                                                </div>
                                                <div class="bottom"></div>
                                            </div>';
                                    }

                        echo '</div></div>';
                    }
                ?>
            </div>
        </div>

        <!-- SKILLS -->
        <div id="main_skills" class="rk">
            <h2 class="tag rk">&lt;skills&gt;</h2>
            <div class="advanced row">
                <div class="container">
                    <h2>&lt;advanced&gt;</h2>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/html5.png" alt="HTML5 Logo">
                        <p>Wstyd by było nie znać HTMLa kiedy chce się zostać frontendowcem, wymieniam go więc jedynie dla porządku.</p>
                    </div>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/css3.png" alt="CSS3 Logo">
                        <p>CSS mam w małym palcu, dam radę przenieść dowolny layout z projektu graficznego do kodu - pixel-perfect.</p>
                    </div>
                    <div class="skill col-sm-12 col-md-4">
                        <img src="img/skills/jquery.png" alt="jQuery Logo">
                        <p>Gdy ktoś mówi JavaScript, ja myślę jQuery. Umiem sam stworzyć co nieco, nie tylko korzystać z pluginów. Obecnie jestem w trakcie przechodzenia na obiektową stronę mocy.</p>
                    </div>
                </div>
            </div>
            <div class="intermediate row">
                <div class="container">
                    <h2>&lt;intermediate&gt;</h2>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/bootstrap.png" alt="Bootstrap Logo">
                        <p>Bootstrap coraz bardziej mi się podoba, czy to do szybkiego postawienia projektu na nogi, czy też do bezbolesnego rozprawienia się z responsywnością.</p>
                    </div>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/wordpress.png" alt="Wordpress Logo">
                        <p>Miałem kiedyś romans z Wordpressem, ale oferował więcej, niż było mi potrzebne. Gdyby jednak była potrzeba, jestem w stanie szybko nadrobić stracony czas.</p>
                    </div>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/sass.png" alt="SASS Logo">
                        <p>Nie mógłbym już wrócić do pisania w samym CSSie, preprocesory to błogosławieństwo, chociażby przez samą obsługę zmiennych i zagnieżdżanie selektorów.</p>
                    </div>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/grunt.png" alt="Grunt Logo">
                        <p>Zaczynam poznawać jak wygodne jest wyręczanie się nim przy co bardziej żmudnych czynnościach towarzyszących kodowaniu.</p>
                    </div>
                    <div class="skill col-sm-12 col-md-4">
                        <img src="img/skills/photoshop.png" alt="Photoshop Logo">
                        <p>Nie jestem designerem i szczerze mówiąc nie przepadam za grzebaniem przy grafice bo nigdy nie jestem w 100% zadowolony z efektu, ale Photoshopa znam na tyle dobrze, żeby wprowadzać poprawki do gotowych projektów czy samemu pociąć layout. Grafik nie będzie miał ze mną ciężko ;)</p>
                    </div>
                </div>
            </div>
            <div class="beginner row">
                <div class="container">
                    <h2>&lt;beginner&gt;</h2>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/php.png" alt="PHP Logo">
                        <p>Backend nie jest moją mocną stroną, w tej chwili PHP używam głównie do łączenia plików za pomocą require_once(), generowania elementów strony na podstawie plików XML i JSON, oraz do komunikacji z bazą danych.</p>
                    </div>
                    <div class="skill col-sm-6 col-md-4">
                        <img src="img/skills/mysql.png" alt="MySQL Logo">
                        <p>Podobnie jak przy PHP, znam ścisłe podstawy - zapisywanie, odczytywanie, wyszukiwanie danych. Jestem w stanie zbudować dla strony prosty system CMS, ale do większych projektów wolę sięgnąć po coś stworzonego przez specjalistów.</p>
                    </div>
                    <div class="skill col-sm-12 col-md-4">
                        <img src="img/skills/angularjs.png" alt="AngularJS Logo">
                        <p>Wiem co to i do czego służy ;) Nie miałem jeszcze potrzeby korzystać z architektury MVC, ale AngularJS jest u mnie na pierwszym miejscu wśród frameworków, które chcę dokładnie poznać.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTACT -->
        <div id="main_contact" class="rk">
            <h2 class="tag rk">&lt;kontakt&gt;</h2>
            <div class="container">
                <div class="row">
                    <div class="about col-md-12">
                        <img src="img/photo.jpg" alt="Zdjęcie">
                        <h2>Robert Kirsz</h2>
                        <p>
                            Informatyk z wykształcenia<br>
                            Front end developer z zamiłowania<br>
                            Niestety nie z zawodu...<br><br>
                            Chciałbym zamiłowanie przemienić w zawód. Jeśli chcesz mi w tym pomóc, skontaktuj się ze mną.<br>
                            Kontakt mailowy: <a href="mailto:robert.kirsz@gmail.com"><i class="fa fa-lg fa-envelope"></i></a><br>
                            CV w PDFie: <a href="pliki/Robert_Kirsz_CV.pdf" class="fa fa-file-pdf-o"></a>
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="form col-md-12">
                        <form name="wiadomosc" action="skrypty/wiadomosc.php" method="POST" accept-charset="utf-8">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                                            <input type="text" class="form-control" name="imie" placeholder="Imię" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                                            <input type="email" class="form-control" name="email" placeholder="Adres email" required="required">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-phone"></span></span>
                                            <input type="text" class="form-control" name="telefon" placeholder="Numer telefonu">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon"><span class="glyphicon glyphicon-question-sign"></span></span>
                                            <input type="text" class="form-control" name="temat" placeholder="Temat">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <textarea name="wiadomosc" name="wiadomosc" class="form-control" rows="8" cols="25" required="required" placeholder="Wiadomość"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <button type="submit" class="btn btn-primary pull-right">Wyślij</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.3.min.js"><\/script>')</script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script src="js/vendor/perfect-scrollbar/js/min/perfect-scrollbar.jquery.min.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='https://www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-24232014-4','auto');ga('send','pageview');
        </script>
    </body>
</html>
