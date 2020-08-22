<?php 

require_once 'SaveData.php';
/**
 * モデルクラス
 * @author kenji uehara
 *
 */
class Model{
	
	
	
	/**
	 * emailに紐づくエンティティを取得する
	 * @param string $email
	 * @return [] エンティティ
	 */
	public function getEntByEmail($email){
	
		$saveData = new SaveData();
		$sql = "SELECT * FROM boxs WHERE email='{$email}'";
		$ent = $saveData->getEnt($sql);
		return $ent;
	}
	
	/**
	 * ボックスをDB用エンティティに加工する
	 * @param [] $box ボックス
	 * @return [] エンティティ
	 */
	public function prosBoxEnt($box){
		$email = $box['info']['email'];
		
		$ent = $this->getEntByEmail($email); // emailに紐づくエンティティを取得する
		
		$box_json = json_encode($box, JSON_HEX_TAG | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_HEX_APOS);
		$box_json = addslashes($box_json);

		$ent['email'] = $email;
		$ent['box_json'] = $box_json;
	
		if(!empty($box['info']['id'])){
			$ent['id'] = $box['info']['id'];
		}
		
		return $ent;
		
	}
	
	
	
	/**
	 * ボックスエンティティを保存する
	 */
	public function saveEnt($ent){
		$saveData = new SaveData();
		$res = $saveData->save('boxs', $ent);
		$ent = $res['rEnt'];
		return $ent;
	}
	
	
	/**
	 * ファイルアップロード処理
	 * @param $_FILES $files ファイル
	 * @param [] $box ボックス
	 * @return string $img_fn 画像ファイル名
	 */
	public function fileUpload($files, &$box){
		$img_fn = 'def.jpg';
		if(!empty($files["imgFile"]) != null){
			$img_fn = $files["imgFile"]["name"]; // 画像ファイル名を取得
			
			$id = $box['info']['id'];
			$pi = pathinfo($img_fn);
			$ext =  $pi['extension'];	// ファイル名から拡張子を取得する
			$ext = mb_strtolower($ext);
			$img_fn = $id . '.' . $ext;
			$img_fp ='../img/' . $img_fn; // 画像ファイルパスを組み立て
			
			// 画像ファイルコピー（配置）
			move_uploaded_file($files["imgFile"]["tmp_name"], $img_fp);
			
			$active_data_index = $box['info']['active_data_index'];
			$box['data'][$active_data_index]['img_fn'] = $img_fn;
			
		}
		return $img_fn;
	}
	
	
}