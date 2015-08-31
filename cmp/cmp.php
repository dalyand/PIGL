<?php

$object=$_POST['object'];



 echo "Object: ".$object."<br>";
 $url='http://www.aktionis.ch/deals?q='.$object.'';
 echo "url: ".$url."<br>";
 
 // Create DOM from URL
$html = file_get_html($url);

// Find all article blocks
foreach($html->find('div.deal-box') as $itemdiv) {
    $item['title']     = $itemdiv->find('div.title', 0)->plaintext;
    $item['intro']    = $itemdiv->find('div.intro', 0)->plaintext;
    $item['details'] = $itemdiv->find('div.details', 0)->plaintext;
    $articles[] = $item;
}

print_r($articles);