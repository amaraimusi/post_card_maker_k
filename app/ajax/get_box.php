<?php 
$json=$_POST['key1'];
$param = json_decode($json,true);

// CSRFトークンのチェック
session_start();
if($param['csrf_token'] != $_SESSION['csrf_token']){
	echo '不正なアクセス';
	die();
}

$email = $param['email'];

require_once 'Model.php';

$model = new Model();
$boxEnt = $model->getEntByEmail($email);


$box = [];
if(!empty($boxEnt)){
	$box_json = $boxEnt['box_json'];
	
	if(!empty($box_json)){
		$box = json_decode($box_json, true);//JSONデコード
	}

}


$box_json = json_encode($box, JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);


echo $box_json;

/**
 * UTF8ファイルのテキストに付いているBOMを除去する
 * @param string $str UTF8ファイルから取得したテキストの文字列
 * @return string BOMを除去した文字列
 */
function deleteBom($str){
	if (($str == NULL) || (mb_strlen($str) == 0)) {
		return $str;
	}
	if (ord($str{0}) == 0xef && ord($str{1}) == 0xbb && ord($str{2}) == 0xbf) {
		$str = substr($str, 3);
	}
	return $str;
}




