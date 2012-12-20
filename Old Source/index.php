<?php session_start(); ?>
<!DOCTYPE html> 
<html> 

<body> 

<?php
include "showlist.php";
//echo "lname: ".$_POST[lname]."<br>";

if(isset($_SESSION['lname'])){
  showlist();
  //echo "Hello World!!";
}
else{
?>

<div data-role="page">
	<div data-role="header">
		<h1>PIGL</h1>
	</div><!-- /header -->
	
	<form action="login.php" method="post">
  <div data-role="fieldcontain" class="ui-hide-label">
	  <label for="lname">Listenname</label>
	  <input type="text" name="lname" id="lname" value="" placeholder="Listenname"/>
	  <label for="pw">Passwort</label>
	  <input type="password" name="pw" id="pw" value="" placeholder="Passwort"/>
	  <input type="submit" value="Anmelden" />
  </div>
  </form>
  <a href="addlist.php" data-role="button">Neue Liste erstellen</a>
  </div><!-- /page -->
<?php 
}
?>



</body>
</html>