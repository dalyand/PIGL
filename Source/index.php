<?php session_start(); ?>
<head>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<?PHP
include "showlist.php";

if(isset($_SESSION['lname']))
showlist();
else{

?>

<html>
<body>

<form action="login.php" method="post">
Liste:<br>
<input type="text" name="lname" /><br>
Passwort:<br>
<input name="pw" type="password" /><br>
<input type="submit" />
</form>
<br>
<br>
<br>
<a href="addlist.php">Ich will eine neue Liste erstellen!</a>

</body>
</html>

<?php
}
?>