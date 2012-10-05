<head>
<link rel="stylesheet" type="text/css" href="style.css" />
</head>
<?php
include "showlist.php";
$con=connectDB();



if(($_POST[lname]!="") && ($_POST[pw]!="")){
  $pw=md5($_POST[pw]);
  $result = mysql_query("SELECT lname FROM list where lname='".$_POST[lname]."'");
  if($row = mysql_fetch_array($result)){
    echo "Der Listenname ".$_POST[lname]." ist bereits vergeben...<br>";
    echo "<a href=\"addlist.php\">Zurueck</a>";
  }else{
    $sql="INSERT INTO list (lname, pw)
          VALUES ('$_POST[lname]','$pw')";    
    if (!mysql_query($sql,$con))
    { 
      die('Error: ' . mysql_error());
    }
    echo "Die Liste ".$_POST[lname]." wurde erfolgreich erstellt!<br>
          Verusechen Sie sich <a href=\"index.php\">hier</a> einzuloggen.";
  }
}else{
  echo "Bitte alle Felder ausfuellen!";
  ?>
  <form action="addlist.php" method="post">
  Listenname:<br>
  <input type="text" name="lname" /><br>
  Passwort:<br>
  <input name="pw" type="password" /><br>
  <input type="submit" />
  </form>
  
  
  
  
  
  <?php
}





mysql_close($con);
?>