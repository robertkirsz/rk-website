<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
<!-- <script src="http://modernizr.com/downloads/modernizr-latest.js"></script> -->
<!-- <script src="http://skrypty/modernizr.js"></script> -->
<script src="<?php echo ROOT ?>bootstrap/js/bootstrap.js"></script>
<script src="<?php echo ROOT ?>bootstrap/validator/js/bootstrapValidator.js"></script>
<script src="<?php echo ROOT ?>bootstrap/validator/js/language/pl_PL.js"></script>
<script src="<?php echo ROOT ?>main.js"></script>
<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . "/googleanalytics/tracking.php");
?>
</body>
</html>
<?php
	//Zamknij ewentualne połączenie z bazą danych
	if (isset($result) && gettype($result) != "boolean") { $result->close(); }
	if (isset($dbc)) { $dbc->close(); }
?>