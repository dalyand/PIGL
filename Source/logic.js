var $id    = new Array();
var $oname = new Array();
var $mass  = new Array();
var $state = new Array();
var $sent  = new Array();
var $sync  = 'offline';
var $count = 100;
var $items = 0;
var $URL="logic.php";
var $queue=false;
var $autoSync=10;//sec
var $autoSyncOff=2;//sec, test frequ. wenn offline
var $backTime=60;//sec
var $timeOut=10;//sec, maximale Wartezeit für Antwort von server
var $lname = "0";
var $pw;
var $step = new Array();
var $timer;
var $autoTimer;
var $timeOutTimer;
var $version = "2"; //If this is changed user needs new login
$IDCount=0;







$(document).bind("mobileinit", function(){
  //apply overrides here
  
});


$( '#list' ).live( 'pageinit',function(event){
  if(!localStorage.version){
    var requestedBytes = 1024*1024*2; // 2MB
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
        navigator.webkitPersistentStorage.requestQuota(requestedBytes);
    }
    commit();
    localStorage.version=$version;
    alert("Herzlich willkommen!! Diese Nachricht sollte nicht immer erscheinen...");
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
    sync();
  });
  $("#logout").click(function(){
    logout();
  });
  
 
  //$.mobile.changePage($("#list"));
  
  list();
  sync();
  if($autoTimer){
    clearInterval($autoTimer);
  }
  $autoTimer=setInterval(function(){
    autoSync();
  },$autoSync*1000);
  $('#back').button('disable');
  $('#back').button('refresh');
  
});

$( '#login' ).live( 'pageinit',function(event){
  if(!localStorage.version){
    commit();
    localStorage.version=$version;
    alert("Herzlich willkommen!! Diese Nachricht sollte nicht immer erscheinen...");
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

// $(document).ready(function(){
//   if(!localStorage['lname']){
//     $.mobile.changePage($("#login"));
//   }else{
//     $.mobile.changePage($("#list"));
//     $("#back").hide();
//     if(!localStorage.oname){
//       commit();
//     }
//     $("#reload").click(function(){
//       sync();
//     });
//     $("#logout").click(function(){
//       logout();
//     });
//     list();
//     sync();
//     setInterval(function(){
//       autoSync();
//     },$autoSync*1000);
//   }
//   
//   
//   
//   
//   
//   /*var source=new EventSource("pigl_sse.php");
//   
//   source.onmessage=function(event)
//   {
//     syncBack(event.data, 'sse');
//     //autoSync();
//     //document.getElementById("result").innerHTML+=event.data + "<br>";
//   };
//   
//   source.onerror=function()
//   {
//     syncTimout();
//     //autoSync();
//     //document.getElementById("result").innerHTML+=event.data + "<br>";
//   };
//   */
//   
//   
// });


function logout(){
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
        sync();
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



function autoSync(){
  //alert("autosync!!");
  sync();
}





function setIcon($icon){
  //$("#icon").html("<img src=\"img/"+$icon+".png\" width=\"20\" height=\"20\">");
  //$("#icon").button('refresh';
  if($icon=='busy'){
    $("#status").html("PIGL - <FONT COLOR=\"#FFA500\">"+"load..."+" &#8635</FONT>");
  }else if($icon=='online'){
    $("#status").html("PIGL - <FONT COLOR=\"#00FF00\">"+$icon+" &#10003</FONT>");
  }else if($icon=='offline'){
    $("#status").html("PIGL - <FONT COLOR=\"#FF0000\">"+$icon+" &#10007</FONT>");
  }
  //$("#status").html("PIGL - "+$icon);
  //var $btn_text  = $('#headerState').find('.ui-btn-text'),
  //$btn_child = $btn_text.find('.ui-collapsible-heading-status');
  //overwrite the header text, then append its child to restore the previous structure
  //$btn_text.text('New String (' + $icon + ')').append($btn_child);

}

function syncBack($data,$status){

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
  $newItems=$newOname.length;
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
    sync();
  }else{
    setIcon("online");
    $sync='online';
  }
}


function sync(){
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
    $sync='busy';
    setIcon("busy");
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
    $.post($URL,
    {
      oname:localStorage['oname'],
      mass:localStorage['mass'],
      state:localStorage['state'],
      lname:localStorage['lname'],
      pw:localStorage['pw']
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
  setIcon('offline');
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
    //Check if obj allready exist
    $exist = false;
    update();
    for($i=0;$i<$items;$i++){
    //Falls Bereits vorhanden
      if($oname[$i]==$formOname){
        $exist = true;
        if($formMass){
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
          sync();
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
          sync();
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
            if($oname[$tmpidx].localeCompare($formOname) == 1){
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
        sync();
      
    }
  }else{
    //Kein Objekname eingegeben...
  }
  //Formular leeren
  $("#oname").val("");
  $("#mass").val("");
  
  
  
  
 
}


function list(){
  $('#to_buy').html("<li data-role=\"list-divider\">Einkaufsliste:</li>");
  update();
  //not killed
  for($i=0;$i<$items;$i++){
    if($state[$i]!='killed'){
      if($mass[$i]==0){
        if($state[$i]=='new'){
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">[+] <u>"+$oname[$i]+"</u></li>");
        }else{
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">"+$oname[$i]+"</li>");
        }
      }else{
        if($state[$i]=='new'){
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">[+] <u>"+$oname[$i]+" x "+$mass[$i]+"</u></li>");
        }else{
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">"+$oname[$i]+" x "+$mass[$i]+"</li>");
        }
      }
    }
  }
  //killed
  for($i=0;$i<$items;$i++){
    if($state[$i]=='killed'){
      if($mass[$i]==0){
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">[-] <s>"+$oname[$i]+"</s></li>");
      }else{
          $("#to_buy").append("<li data-icon=\"check\" id=\"item"+$id[$i]+"\" onclick=\"remove_n('item"+$id[$i]+"')\">[-] <s>"+$oname[$i]+" x "+$mass[$i]+"</s></li>");
      }
    }
  }
  $('#to_buy').listview('refresh'); 
}



function back(){
  clearInterval($timer);
  $('#back').button('disable');
  $('#back').text("... zurueck nehmen!");
  $('#back').button('refresh');
  add('bck');
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
          $mass[$i]="";
          commit();
        }else{
          $state[$i]='killed';
          $sent[$i]=false;
          commit();
          sync();
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
  $items = Number(localStorage['items']);
  $lname = localStorage['lname'];
  $pw = localStorage['pw'];
  $IDCount = Number(localStorage['idcount']);
}

function commit(){
  commitOname();
  commitMass();
  commitState();
  commitSent(); 
  commitStep();
  commitID();
  localStorage['items'] = $items;
  localStorage['pw'] = $pw;
  localStorage['lname'] = $lname;
  localStorage['idcount'] = $IDCount;
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
