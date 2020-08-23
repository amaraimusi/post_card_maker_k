<?php 
$json=$_POST['key1'];
$param = json_decode($json,true);

// CSRFトークンのチェック
session_start();
if($param['csrf_token'] != $_SESSION['csrf_token']){
	echo '不正なアクセス';
	die();
}

$box = $param['box'];

require_once 'Model.php';

$model = new Model();

// ファイルアップロード処理
$img_fn = $model->fileUpload($_FILES, $box);

// 画像ファイル名をセットする
if(!empty($img_fn)){
	$active_data_index = $box['info']['active_data_index'];
	$box['data'][$active_data_index]['img_fn'] = $img_fn;
}

$boxEnt = $model->prosBoxEnt($box);

$ent = $model->saveEnt($boxEnt); // ボックスエンティティをDB保存する
$id = $ent['id'];

$res = ['id'=>$id, 'img_fn'=>$img_fn];

$json = json_encode($res, JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);

echo $json;