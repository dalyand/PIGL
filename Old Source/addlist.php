
<?php
include "showlist.php";
echo "<div data-role=\"page\">";
?>
<div data-role="header">
		<h1>PIGL</h1>
	</div><!-- /header -->

<?php
$con=connectDB();



if(($_POST[lname]!="") && ($_POST[pw]!="")){
  echo "<div data-role=\"content\">";
  $pw=md5($_POST[pw]);
  $result = mysql_query("SELECT lname FROM list where lname='".$_POST[lname]."'");
  if($row = mysql_fetch_array($result)){
    echo "<p>Der Listenname ".$_POST[lname]." ist bereits vergeben...</p>";
  }else{
    $sql="INSERT INTO list (lname, pw)
          VALUES ('$_POST[lname]','$pw')";    
    if (!mysql_query($sql,$con))
    { 
      die('Error: ' . mysql_error());
    }
    echo "<p>Die Liste ".$_POST[lname]." wurde erfolgreich erstellt!<br>
          Verusechen Sie sich <a href=\"index.php\">hier</a> einzuloggen.</p>";
  }
  echo "</div>";
}else{
  //echo "Bitte alle Felder ausfuellen!";
  ?>
  <form action="addlist.php" method="post">
  <div data-role="fieldcontain" class="ui-hide-label">
     <label for="lname">Listenname</label>
	  <input type="text" name="lname" id="lname" value="" placeholder="Listenname"/>
    <label for="pw">Passwort</label>
	  <input type="password" name="pw" id="pw" value="" placeholder="Passwort"/>
    <input type="submit" value="Liste erstellen" />
  </div>
  </form>
  
  
  
  
  
  <?php
}





mysql_close($con);
?>
</div>
</body>