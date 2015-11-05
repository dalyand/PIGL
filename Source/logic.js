var $id    = new Array();
var $oname = new Array();
var $mass  = new Array();
var $state = new Array();
var $sent  = new Array();
var $sync  = 'busy';
var $count = 100;
var $items = 0;
var $URL="logic.php";
var $queue=false;
var $autoSync=30;//sec
var $autoSyncOff=2;//sec, test frequ. wenn offline
var $backTime=60;//sec
var $timeOut=10;//sec, maximale Wartezeit für Antwort von server
var $loadIconDelay=2000;//ms, Delay to switch the Icon to load if online
var $loadIconTimer;
var $lname = "0";
var $pw;
var $step = new Array();
var $timer;
var $autoTimer;
var $timeOutTimer;
var $version = "2"; //If this is changed user needs new login (change if localstorage structure changes)
var $dispVersion = "Version 6.2"; //This is the displayed version, should be the same like in the appcache file.
var $secOnline = 0;
var $secNow = 0;
var $timeDiff = 0;
var $timeUnit = "s";
var $iconTimer;
var $requestID=0;
var $respondID=0;
/*
first dimension is list, second:
0 lname
1 pw
2 items
3 timestamp
4 onames
5 mass
6 state
*/
var $allLists=new Array();
$IDCount=0;







$(document).bind("mobileinit", function(){
  //apply overrides here
  
});


$(document).on('pageinit', '#list', function(){
//$( '#list' ).live( 'pageinit',function(event){
  if(!localStorage.version){
    var requestedBytes = 1024*1024*2; // 2MB
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
        navigator.webkitPersistentStorage.requestQuota(requestedBytes);
    }
    commit();
    localStorage.version=$version;
    //alert("Herzlich willkommen bei PIGL!!");
  }else if(localStorage.version != $version){
    commit();
    localStorage.version=$version;
    alert("Seit Ihrem letzten Besuch hat es eine Aktuallisierung gegeben. Sie müssen sich noch ein mal anmelden.");
  }else{
    update();
  }
  
  if(!localStorage['lname'] || localStorage['lname']=="0"){
    $.mobile.changePage($("#login"));
  }
  
  
  $("#reload").click(function(){
    sync(1);
  });
  $("#logout").click(function(){
    logout();
  });
  $("#addList").click(function(){
    logoutAdd();
  });
  
 
  //$.mobile.changePage($("#list"));
  
  list();
  $sync  = 'busy';
  setIcon($sync, 0);
  sync(0);
  if($autoTimer){
    clearInterval($autoTimer);
  }
  $autoTimer=setInterval(function(){
    autoSync();
  },$autoSync*1000);
  $iconTimer=setInterval(function(){
    setIcon($sync, 0);
  },1000);
  
  $( "#popupShare" ).bind({
       popupbeforeposition: function(event, ui) { 
        update();
        $("#infoList").html("<b>"+$lname+"</b>");
        $("#infoPW").html("<b>"+$pw+"</b>");
    }
  });

  $("#panelfoot").html("PIGL ("+$dispVersion+")");

  $('#back').button();
  //$('#back').bind( "click", function(event, ui) {
  //  back()
  //});
  $('#back').button('disable');
  $('#back').button('refresh');
  
});


$(document).on('pageinit', '#login', function(){
//$( '#login' ).live( 'pageinit',function(event){
  if(!localStorage.version){
    commit();
    localStorage.version=$version;
   // alert("Herzlich willkommen!! Diese Nachricht sollte nicht immer erscheinen...");
  }else if(localStorage.version != $version){
    commit();
    localStorage.version=$version;
    alert("Seit Ihrem letzten Besuch hat es eine Aktuallisierung gegeben. Sie müssen sich noch ein mal anmelden.");
  }else{
    update();
  }
  if(localStorage['lname'] && localStorage['lname']!="0"){
    $.mobile.changePage($("#list"));
  }
});

$(document).on('pageshow', '#login', function(){
  if($allLists.length>0){
    $('#listlogin').html("<li data-role=\"list-divider\">Meine Listen:</li>");
    $secNowList = Date.now() / 1000 | 0;
    for($i=0;$i<$allLists.length;$i++){
      $secOnlineList=$allLists[$i][3];
      calcTimeList();
      $('#listlogin').append("<li id=\"goTolist"+$allLists[$i][0]+"\">"+$allLists[$i][0]+"<span class=\"ui-li-count\">"+$allLists[$i][2]+", "+getTwoDigits($timeDiffList)+$timeUnitList+"</span></li>");
      $("#goTolist"+$allLists[$i][0]+"").on( "click", function( event ) { 
        goToList(event.currentTarget.id);
      } );
    }
    //$('#listlogin').append("<li id=\"addlist\">Liste hinzufügen...</li>");
    $('#listlogin').listview('refresh'); 
  }else{
    $('#listlogin').html("");
  }
});

//$( '#register' ).live( 'pageinit',function(event){  
//});
function goToList($listname){
  update();
  for(var $i=0;$i<$allLists.length;$i++){
    if("goTolist"+$allLists[$i][0] == $listname){
      $lname=     $allLists[$i][0];
      $pw=        $allLists[$i][1];
      $items=     $allLists[$i][2];
      $secOnline= $allLists[$i][3];
      $secNow = Date.now() / 1000 | 0;
      calcTime(0);
      $oname=     JSON.parse($allLists[$i][4]);
      $mass=      JSON.parse($allLists[$i][5]);
      $state=     JSON.parse($allLists[$i][6]);
      $requestID++;
      commit();
      $.mobile.changePage($("#list"));
      list();
      //sync(0);
      break;
    }
  }
}


function getID(){
  //update();
  if($IDCount >= 1000){
    $IDCount=0;
  }else{
    $IDCount=$IDCount+1;
  }
  //commit();
  return $IDCount;
}


function logout(){
  update();
  for(var $i=0;$i<$allLists.length;$i++){
    if($lname==$allLists[$i][0]){
      $allLists.splice($i, 1);
      break;
    }
  }
  $lname="";
  $pw="";
  commit();
  $.mobile.changePage($("#login"));
}

function logoutAdd(){
  $lname="";
  $pw="";
  commit();
  $.mobile.changePage($("#login"));
}


function loginDB(){
  $formLname = $("#lname").val();
  $formPW = $("#pw").val();
  //...Hier Kontrolle der Eingabe...
  if($formLname && $formPW){
    $.mobile.loading( 'show' );
    localStorage['pw']=$formPW;
    $.post("login.php",
    {
      lname:$formLname,
      pw:$formPW
    },
    function(data,status){
      if(data!='0'){
        localStorage['lname']=data;
        $.mobile.changePage($("#list"));
        sync(0);
      }else{
        $.mobile.loading( 'hide' );
        alert("Falscher Listenname oder falsches Passwort.");
      }
    })
    .error(function() {
      $.mobile.loading( 'hide' );
      alert("Verbindung konnte nicht hergestellt werden.");
    });

  }else{
    alert("Bitte Listenname und Passwort eingeben.");
  }
}

function registerDB(){
  $formLname = $("#lnameReg").val();
  $formPW = $("#pwReg").val();
  $formPW2 = $("#pwReg2").val();
  //...Hier Kontrolle der Eingabe...
  if($formLname && $formPW && $formPW2){
    if($formPW == $formPW2){
      if($formLname.length <= 40){
        $.mobile.loading( 'show' );
        localStorage['pw']=$formPW;
        $.post("register.php",
        {
          lname:$formLname,
          pw:$formPW
        },
        function(data,status){
          if(data!='0'){
            localStorage['lname']=data;
            $.mobile.changePage($("#list"));
            sync(0);
          }else{
            $.mobile.loading( 'hide' );
            alert("Dieser Listenname wird leider bereits verwendet.");
          }
        })
        .error(function() {
          $.mobile.loading( 'hide' );
          alert("Verbindung konnte nicht hergestellt werden.");
        });
      }else{
        alert("Der Listenname darf maximal 40 Zeichen haben.");
      }
    }else{
      alert("Die Passwörter stimmen nicht überein!");
    }
  }else{
    alert("Bitte Listenname und 2 x Passwort eingeben.");
  }
}



function autoSync(){
  //alert("autosync!!");
  sync(0);
}


function calcTime($offset){
    $timeDiff = $secNow - $secOnline + $offset;//seconds
    $timeUnit="s";
    if(Math.abs($timeDiff)>59){
        $timeDiff = Math.round($timeDiff/60);//minutes
        $timeUnit="m";
        if(Math.abs($timeDiff)>59){
          $timeDiff = Math.round($timeDiff/60);//hours
          $timeUnit="h";
          if(Math.abs($timeDiff)>23){
            $timeDiff = Math.round($timeDiff/24);//days
            if(Math.abs($timeDiff)>99){
                if($timeDiff>0){
                  $timeDiff=99;
                }else{
                  $timeDiff=-99;
                }
            }
            $timeUnit="d";
          }
        }
    }
}

function getTwoDigits($num){
  var $ret="";
  if($num<0){
    $ret="-";
  }
  if(Math.abs($num)<10){
    $ret=""+$ret+"0"+Math.abs($num);
    //$ret=""+$ret+""+Math.abs($num);
  }else{
    $ret=""+$ret+""+Math.abs($num);
  }
  return $ret;
}

function setIcon($icon, $changed){
  //$("#icon").html("<img src=\"img/"+$icon+".png\" width=\"20\" height=\"20\">");
  //$("#icon").button('refresh';
  update();
  if($changed){
    if($loadIconTimer){
      clearInterval($loadIconTimer);
    }
  }
  $secNow = Date.now() / 1000 | 0;
  if($icon=='busy'){
    if(!$changed){
      calcTime(0);
    }
    $("#status").html("<FONT COLOR=\"#CB8400\">&#8635 Load...</FONT>");
    $("#reload").html(""+ getTwoDigits($timeDiff) +""+$timeUnit);
  }else if($icon=='online'){
    if($changed){
      $secOnline = Date.now() / 1000 | 0;
      for(var $i=0;$i<$allLists.length;$i++){
        if($lname==$allLists[$i][0]){
          $allLists[$i][3] = $secOnline;
          break;
        }
      }
      commit();
      list();
    }
    calcTime(0);
    $("#status").html("<FONT COLOR=\"#00A000\">&#10003 Online</FONT>");
    $("#reload").html(""+ getTwoDigits($timeDiff) +""+$timeUnit);
    if(($secNow-$secOnline)>$autoSync+($loadIconDelay/1000)){
        sync(1);
    }
  }else if($icon=='offline'){
    if(!$changed){
      calcTime(0);
    }
    $("#status").html("<FONT COLOR=\"#A00000\">&#10007 Offline</FONT>");
    $("#reload").html(""+ getTwoDigits($timeDiff) +""+$timeUnit);
  }
  //$("#status").html("PIGL - "+$icon);
  //var $btn_text  = $('#headerState').find('.ui-btn-text'),
  //$btn_child = $btn_text.find('.ui-collapsible-heading-status');
  //overwrite the header text, then append its child to restore the previous structure
  //$btn_text.text('New String (' + $icon + ')').append($btn_child);

}

function syncBack($data,$status){
  if($data!="0"){
    localStorage['syncdata']=$data;
    localStorage['syncstatus']=$status;

    if($autoTimer){
      clearInterval($autoTimer);
    }
    $autoTimer=setInterval(function(){
      autoSync();
    },$autoSync*1000);
    if($timeOutTimer){
      clearInterval($timeOutTimer);
    }

    var myString = $data;
    var myArray = myString.split(';;;;;');
    $newOname=JSON.parse(myArray[0]);
    $newMass=JSON.parse(myArray[1]);
    $newState=JSON.parse(myArray[2]);
    $respondID=myArray[3];
    $newItems=$newOname.length;
    if($respondID==$requestID){
      update();
      for($k=0;$k<$items;$k++){
        if($sent[$k]==true){//gesendet
          if($state[$k]=='killed'){//bereits gelöscht??
            $deleted=true;
            for($j=0;$j<$newItems;$j++){
                if($oname[$k]==$newOname[$j]){
                  $deleted=false;
                  break;
                }
            }
            if($deleted){
              delObj($k);
              $k--;//Wenn objekt gelöscht wird muss noch mal der selbe index kontrolliert werden.
            }
          }else if($state[$k]=='new'){//bereits hinzugefügt??
            $added=false;
            for($j=0;$j<$newItems;$j++){
              if($oname[$k]==$newOname[$j]){
                $added=true;
                break;
              }
            }
            if($added){
              delObj($k);
              $k--;//Wenn objekt gelöscht wird muss noch mal der selbe index kontrolliert werden.
            }
          }else{
            delObj($k);
            $k--;//Wenn objekt gelöscht wird muss noch mal der selbe index kontrolliert werden.
          }
        }
      }
      commit();
      //update();
      for($j=0;$j<$newItems;$j++){
      $exist=false;
        for($i=0;$i<$items;$i++){
          if($oname[$i]==$newOname[$j]){
            $exist=true;
            if($state[$i]=='normal'){
                delObj($i);
                $oname[$items]=$newOname[$j];
                $mass[$items]=$newMass[$j];
                $state[$items]=$newState[$j];
                getID();
                $id[$items]= $IDCount;
                $items=$items+1;
            }
            break;
          }
        }
        if(!$exist){
          $oname[$items]=$newOname[$j];
          $mass[$items]=$newMass[$j];
          $state[$items]=$newState[$j];
          getID();
          $id[$items]= $IDCount;
          $items=$items+1;
        }
      }
      commit();
      $queue = false;
      for($i=0;$i<$items;$i++){
        if($state[$i]!='normal'){
          $queue=true;
          break;
        }
      }
      list();
      if($queue){
        sync(0);
      }else{
        setIcon("online",1);
        $sync='online';
      }
    }
  }
}


function sync($human){
  localStorage['syncdata']="";
  localStorage['syncstatus']="";
  //if($sync!='busy' || ($queue && ($sync!='busy'))){
  //if($sync!='busy'){
  if($autoTimer){
    clearInterval($autoTimer);
  }
  $autoTimer=setInterval(function(){
    autoSync();
  },$autoSync*1000);
  if($timeOutTimer){
    clearInterval($timeOutTimer);
  }

    $queue=false;
    if($human){
      $sync='busy';
      setIcon("busy",1);
    }else{
      if($loadIconTimer){
        clearInterval($loadIconTimer);
      }
      $loadIconTimer=setInterval(function(){
        $sync='busy';
        setIcon("busy",1);
        clearInterval($loadIconTimer);
      },$loadIconDelay);
    }
    update();
    for($i=0;$i<$items;$i++){
      $sent[$i]=true;
    }
    commit();
    if($timeOutTimer){
      clearInterval($timeOutTimer);
    }
    $timeOutTimer=setInterval(function(){
      syncTimout();
    },$timeOut*1000);  
    $requestID++;
    $.post($URL,
    {
      oname:localStorage['oname'],
      mass:localStorage['mass'],
      state:localStorage['state'],
      lname:localStorage['lname'],
      pw:localStorage['pw'],
      id:$requestID
    },
    function(data,status){
      syncBack(data,status);
      //alert("Data: " + data + "\nStatus: " + status);
    })
    .error(function() { syncTimout(); });
}

function syncTimout(){
//if($sync=='busy'){
  $sync='offline';
  setIcon('offline',1);
  if($timeOutTimer){
    clearInterval($timeOutTimer);
  }
  if($autoTimer){
    clearInterval($autoTimer);
  }
  $autoTimer=setInterval(function(){
    autoSync();
  },$autoSyncOff*1000);
//}
}


function add($str){
  if($str=='usr'){
    //Formular auslesen, Daten speichern
    $formOname = $("#oname").val();
    $formMass = $("#mass").val();
  }else{
    $formOname = $step[0];
    $formMass = $step[1];
  }
  //...Hier Kontrolle der Eingabe...
  //$formOname = $formOname.replace(/ /g,"_");// /PID/g,"111111"
  if($formOname){
    if($formOname.length > 40){
    //too long name...
      $formOname = $formOname.substring(0,40);
      alert("Der Produktname war zu lang und wurde auf 40 Zeichen gekürzt.");
    }
    //Check if obj allready exist
    $exist = false;
    update();
    for($i=0;$i<$items;$i++){
    //Falls Bereits vorhanden
      if($oname[$i]==$formOname){
        $exist = true;
        if($formMass){
          if($formMass.length > 40){
          //too long name...
            $formMass = $formMass.substring(0,40);
            alert("Das Mass war zu lang und wurde auf 40 Zeichen gekürzt.");
          }
          $mass[$i]  = $formMass;
          $sent[$i] = false;
          if($state[$i]=='killed'){
           // $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">"+$formOname+" x "+$formMass+"</li>");
           // $('#to_buy').listview('refresh');
          }else{
           // $("#"+$formOname).remove();
           // $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">"+$formOname+" x "+$formMass+"</li>");
           // $('#to_buy').listview('refresh'); 
          }
          $state[$i] = 'new';
          commit();
          list();
          sync(1);
        }else{
          if($state[$i]=='killed'){
           // $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">"+$formOname+"</li>");
           // $('#to_buy').listview('refresh');
          }
          $tmpState=$state[$i];
          /*if(($tmpState=='killed') && ($sent[$i] == true)){
            $state[$i] = 'new';
            $sent[$i] = false;
          }else if(($tmpState=='killed') && ($sent[$i] == false)){
            $state[$i]='normal';
          }*/
          if($mass[$i]!=0){
            $mass[$i]  = 0;
          }
          $state[$i] = 'new';
          $sent[$i] = false;
          commit();
          list();
          sync(1);
        } 
        break; 
      }   
    }
    //Falls noch nicht vorhanden
    if(!$exist){
        update();
        $tmpidx=0;
        for($tmpidx=0;$tmpidx<$items;$tmpidx++){
            //if($oname[$tmpidx] > $formOname){
            //    break;
            //}
            if($oname[$tmpidx].toLowerCase().localeCompare($formOname.toLowerCase()) == 1){
                break;
            }
        }
        if($tmpidx < $items){
            for($i=$items;$i>$tmpidx;$i--){
                $oname[$i]=$oname[$i-1];
                $mass[$i]=$mass[$i-1];
                $state[$i]=$state[$i-1];
                $sent[$i]=$sent[$i-1];
                $id[$i]=$id[$i-1];
            }
        }else{
            $tmpidx=$items;
        }
          $oname[$tmpidx] = $formOname;
          if($formMass){
            if($formMass.length > 40){
            //too long name...
              $formMass = $formMass.substring(0,40);
              alert("Das Mass war zu lang und wurde auf 40 Zeichen gekürzt.");
            }
            $mass[$tmpidx]  = $formMass;
          }else{
            $mass[$tmpidx]  = "";
          }
          $sent[$tmpidx] = false;
          $state[$tmpidx] = 'new';
          getID();
          $id[$tmpidx]    = $IDCount;
          $items = $items+1;
        commit();
        //$("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$items-1]+"\" onclick=\"remove_n('item"+$id[$items-1]+"')\">"+$formOname+"</li>");
        //$('#to_buy').listview('refresh');
        list();
        sync(1);
      
    }
  }else{
    //Kein Objekname eingegeben...
  }
  //Formular leeren
  $("#oname").val("");
  $("#mass").val("");
  
  
  
  
 
}


function calcTimeList(){
    $timeDiffList = $secNowList - $secOnlineList;//seconds
    if(true){//Always use minutes
        $timeDiffList = Math.round($timeDiffList/60);//minutes
        $timeUnitList="m";
        if(Math.abs($timeDiffList)>59){
          $timeDiffList = Math.round($timeDiffList/60);//hours
          $timeUnitList="h";
          if(Math.abs($timeDiffList)>23){
            $timeDiffList = Math.round($timeDiffList/24);//days
            if(Math.abs($timeDiffList)>99){
                if($timeDiffList>0){
                  $timeDiffList=99;
                }else{
                  $timeDiffList=-99;
                }
            }
            $timeUnitList="d";
          }
        }
    }
}

function list(){
  $.event.special.tap.tapholdThreshold = 500;
  update();
  $("#paneltitle").html(""+$lname);
  $("#listtitle").html(""+$lname);

  //Lists
  var inList = false;
  for(var $i=0;$i<$allLists.length;$i++){
    if($lname==$allLists[$i][0]){
      inList=true;
      break;
    }
  }
  if(!inList && $lname!=="" && $lname!=="0"){
    $i=$allLists.length;
    $allLists[$i]=new Array();
    $allLists[$i][0]=$lname;
    $allLists[$i][1]=$pw;
    $allLists[$i][2]=$items;
    $allLists[$i][3]=$secOnline;
    $allLists[$i][4]=JSON.stringify($oname);
    $allLists[$i][5]=JSON.stringify($mass);
    $allLists[$i][6]=JSON.stringify($state);
  }else if(inList){
    $allLists[$i][0]=$lname;
    $allLists[$i][1]=$pw;
    $allLists[$i][2]=$items;
    $allLists[$i][3]=$secOnline;
    $allLists[$i][4]=JSON.stringify($oname);
    $allLists[$i][5]=JSON.stringify($mass);
    $allLists[$i][6]=JSON.stringify($state);
  }
  if($allLists.length>1){
    $('#listlist').html("<li data-role=\"list-divider\">Meine Listen:</li>");
    $secNowList = Date.now() / 1000 | 0;
    for($i=0;$i<$allLists.length;$i++){
      $secOnlineList=$allLists[$i][3];
      calcTimeList();
      if($lname==$allLists[$i][0]){
        $('#listlist').append("<li id=\"changelist"+$allLists[$i][0]+"\"><b>"+$allLists[$i][0]+"</b><span class=\"ui-li-count\">"+$allLists[$i][2]+"</span></li>");
      }else{
        $('#listlist').append("<li id=\"changelist"+$allLists[$i][0]+"\">"+$allLists[$i][0]+"<span class=\"ui-li-count\">"+$allLists[$i][2]+", "+getTwoDigits($timeDiffList)+$timeUnitList+"</span></li>");
        $("#changelist"+$allLists[$i][0]+"").on( "click", function( event ) { 
          changelist(event.currentTarget.id);
        } );
      }
    }
    //$('#listlist').append("<li id=\"addlist\">Liste hinzufügen...</li>");
    $('#listlist').listview('refresh'); 
  }else{
    $('#listlist').html("");
  }
  

  $('#to_buy').html("<li data-role=\"list-divider\">Einkaufsliste ("+$lname+"):</li>");
  if($items>0){
    //not killed
    for($i=0;$i<$items;$i++){
      if($state[$i]!='killed'){
        if($mass[$i]==0){
          if($state[$i]=='new'){
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">[+] <u>"+$oname[$i]+"</u></li>");
          }else{
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">"+$oname[$i]+"</li>");
          }
        }else{
          if($state[$i]=='new'){
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">[+] <u>"+$oname[$i]+"<span class=\"ui-li-count\">"+$mass[$i]+"</span></u></li>");
          }else{
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">"+$oname[$i]+"<span class=\"ui-li-count\">"+$mass[$i]+"</span></li>");
          }
        }
        $("#item"+$id[$i]+"").on( "click", function( event ) { 
          remove_n(event.currentTarget.id);
        } );
        $("#item"+$id[$i]+"").on( "taphold", function( event ) { 
          for($i=0;$i<$items;$i++){
            if("item"+$id[$i] == event.currentTarget.id){
              $("#oname").val($oname[$i]);
              if($mass[$i]!="0"){
                $("#mass").val($mass[$i]);
              }else{
                $("#mass").val("");
              }
              remove_n(event.currentTarget.id);
              break;
            }
          }
        } );
      }
    }
    //killed
    for($i=0;$i<$items;$i++){
      if($state[$i]=='killed'){
        if($mass[$i]==0){
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">[-] <s>"+$oname[$i]+"</s></li>");
        }else{
            $("#to_buy").append("<li id=\"item"+$id[$i]+"\">[-] <s>"+$oname[$i]+"<span class=\"ui-li-count\">"+$mass[$i]+"</span></s></li>");
        }
      }
    }
  }else{
    $("#to_buy").append("<li data-role=\"list-divider\">Die Liste ist leer.</li>");
  }
  $('#to_buy').listview('refresh'); 
  commit();
}



function back(){
  clearInterval($timer);
  $('#back').button('disable');
  $('#back').text("... zurueck nehmen!");
  $('#back').button('refresh');
  add('bck');
}

function changelist($listname){
  update();
  for(var $i=0;$i<$allLists.length;$i++){
    if("changelist"+$allLists[$i][0] == $listname){
      $lname=     $allLists[$i][0];
      $pw=        $allLists[$i][1];
      $items=     $allLists[$i][2];
      $secOnline= $allLists[$i][3];
      $secNow = Date.now() / 1000 | 0;
      calcTime(0);
      $oname=     JSON.parse($allLists[$i][4]);
      $mass=      JSON.parse($allLists[$i][5]);
      $state=     JSON.parse($allLists[$i][6]);
      $requestID++;
      break;
    }
  }
  commit();
  list();
  //$.mobile.changePage($("#list"));
}

function remove_n($formOname){
//  $("#"+$formOname).remove();
//  $('#to_buy').listview('refresh');
  update();
    for($i=0;$i<$items;$i++){
      //if($oname[$i]==$formOname){
      if("item"+$id[$i]==$formOname){
        $step[0]=$oname[$i];
        $step[1]=$mass[$i];
        commit();
        $('#back').button('enable');
        $('#back').text("\""+$step[0]+"\" zurueck nehmen!");
        $('#back').button('refresh');
        if($timer){
          clearInterval($timer);
        }
        $timer=setInterval(function(){
          $('#back').button('disable');
          $('#back').text("... zurueck nehmen!");
          $('#back').button('refresh');
          clearInterval($timer);
        },$backTime*1000);
        //$.mobile.changePage($("#list"));
        if($state[$i]=='new' && ($sent[$i]==false)){
          delObj($i);
          commit();
        }else if($state[$i]=='new' && ($sent[$i]==true)){
          $sent[$i]=false;
          $state[$i]='killed';
          //$mass[$i]="";
          commit();
        }else{
          $state[$i]='killed';
          $sent[$i]=false;
          commit();
          sync(1);
        }
      //commit();
      list();
      break;
    }
  }
}

function delObj($nr){
  for($i=$nr;$i<$items-1;$i++){
    $oname[$i]=$oname[$i+1];
    $mass[$i]=$mass[$i+1];
    $state[$i]=$state[$i+1];
    $sent[$i]=$sent[$i+1];
    $id[$i]=$id[$i+1];
  }
  $oname.pop();
  $mass.pop();
  $state.pop();
  $sent.pop();
  $id.pop();
  $items=$items-1;
}

/*
function addObj(){

}
*/

function update(){
  updateOname();
  updateMass();
  updateState();
  updateSent();
  updateStep();
  updateID();
  updateAllLists();
  $items = Number(localStorage['items']);
  $lname = localStorage['lname'];
  $pw = localStorage['pw'];
  $IDCount = Number(localStorage['idcount']);
  $secOnline = Number(localStorage['secOnline']);
}

function commit(){
  commitOname();
  commitMass();
  commitState();
  commitSent(); 
  commitStep();
  commitID();
  commitAllLists();
  localStorage['items'] = $items;
  localStorage['pw'] = $pw;
  localStorage['lname'] = $lname;
  localStorage['idcount'] = $IDCount;
  localStorage['secOnline'] = $secOnline;
}
/*
first dimension is list, second:
0 lname
1 pw
2 items
3 timestamp
4 onames
5 mass
6 state
*/
function updateAllLists(){
  var allListsStr = localStorage['allLists'];
  $allLists=new Array();
  if(typeof allListsStr !== 'undefined'){
    allListsStr=allListsStr.split(";;;;;");
    allListsStr.pop();
    for(var $j=0;$j<allListsStr.length;$j++){
      $allLists[$j]=JSON.parse(allListsStr[$j]);
      $allLists[$j][2] = Number($allLists[$j][2]);
      $allLists[$j][3] = Number($allLists[$j][3]);
    }
  }
  
}

function commitAllLists(){
  var allListsStr = "";
  if($allLists.length>0){
    for(var $j=0;$j<$allLists.length;$j++){
      allListsStr=allListsStr+JSON.stringify($allLists[$j])+";;;;;";
    }
  }
  localStorage['allLists']=allListsStr;
}

function updateOname(){
  $oname = JSON.parse(localStorage['oname']);
}

function commitOname(){
  localStorage['oname']=JSON.stringify($oname);
}

function updateMass(){
  $mass = JSON.parse(localStorage['mass']);
}

function commitMass(){
  localStorage['mass']=JSON.stringify($mass);
}

function updateState(){
  $state = JSON.parse(localStorage['state']);
}

function commitState(){
  localStorage['state']=JSON.stringify($state);
}

function updateSent(){
  $sent = JSON.parse(localStorage['sent']);
}

function commitSent(){
  localStorage['sent']=JSON.stringify($sent);
}

function updateStep(){
  $step = JSON.parse(localStorage['step']);
}

function commitStep(){
  localStorage['step']=JSON.stringify($step);
}


function updateID(){
  $id = JSON.parse(localStorage['id']);
}

function commitID(){
  localStorage['id']=JSON.stringify($id);
}
