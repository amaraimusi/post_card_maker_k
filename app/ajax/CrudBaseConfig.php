<?php
class CrudBaseConfig{
	

	/**
	 * DB設定
	 * @return string[] DB設定情報
	 */
	public function getDbConfig(){
		$dbConfig = [
			'host'=>'localhost',
			'db_name'=>'pcmk',
			'user'=>'root',
			'pw'=>'neko',
		]; 
		
		return $dbConfig;
	}
	
}