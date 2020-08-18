<?php 
$json=$_POST['key1'];
$data = json_decode($json,true);


require_once 'Model.php';

$res = ['success'=>1];

$json = json_encode($res, JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);

echo $json;