<?php
class CrudBaseConfig{
	

	/**
	 * DB設定
	 * @return string[] DB設定情報
	 */
	public function getDbConfig(){
		
		$dbConfig = [];
		
		if($_SERVER["HTTP_HOST"] == 'localhost'){
			
			$dbConfig = [
					'host'=>'localhost',
					'db_name'=>'pcmk',
					'user'=>'root',
					'pw'=>'neko',
			]; 
		}else{
			$dbConfig = [
				'host'=>'mysql716.db.sakura.ne.jp',
				'db_name'=>'amaraimusi_pcmk',
				'user'=>'amaraimusi',
				'pw'=>'aka3siro3',
			]; 
		}
		
		
		
		
		
		return $dbConfig;
	}
	
}