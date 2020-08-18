
/**
 * ポストカードメーカーKクラス
 * @since 2020-8-9
 * @version 0.1
 * @auther kenji uehara
 * @license MIT
 */
class PostCardMakerK{
	
	/**
	 * 初期化
	 */
	init(){

		this.csrf_token = jQuery('#csrf_token').val(); // CSRFトークン
		this.ls_key = this._getLsKey(); // ローカルストレージキー
		this.box = this._getBox();
		
		let email = this.box.info.email; // メールアドレスを取得する
		
		// メールアドレスが空なら新規の処理
		if(email == ''){
			this._showData(); // 画面にデータを表示
		}else{
			this._getBoxByAjax(); // Ajaxを通してデータ取得を行う。
		}
		
		
		

		
//		this.ls_key = this._getLsKey(); // ローカルストレージキー
//		this.ls_key_data_url = this._getLsKeyForDataUrl(); // ローカルストレージキー(データURLスキーム）
//		let data = this._getData();
//
//		this.app = new Vue({
//			el: '#app1',
//			data: data,
//			methods: {
//				clickEditMode:()=>{this._clickEditMode();}, // 編集モードにする
//				configApply:()=>{this._configApply();}, // 設定を適用する
//				blurSizeRate:()=>{this._sizeRefresh();}, // サイズ適用
//				changeQrCodeSize:()=>{this._changeQrCodeSize();}, // QRコードサイズ変更
//			filters: {
//					filPer: (value) => {
//						return value + '%';
//					}
//				},
//			}
//		});
//		
//		
//		this.card = jQuery('#post_card');
//		this._sizeRefresh();
//		
//		this.data_url = this._loadDataUrlFromLs(); // ローカルから画像データURLスキームを取得しIMG要素にセットする。
//
//		// ▽QRコード関連
//		this.qrCodeElm = jQuery('#qr_code'); // QRコード要素
//		this._makeQrCode(); // QRコードを作成
		

		
	}
	
	/**
	 * 画面にデータを表示
	 */
	_showData(){
				
		let active_data_index = this.box.info.active_data_index; // アクティブデータインデックス
		let ent = this.box.data[active_data_index];
		
			this.app = new Vue({
			el: '#app1',
			data: {
				info:this.box.info,
				ent:ent,
			},
			methods: {
				regMailaddr:() => {this._regMailaddr();}, // メールアドレス登録ボタンクリック（「次へ」ボタン）
				clickEditMode:()=>{this._clickEditMode();}, // 編集モードにする
				configApply:()=>{this._configApply();}, // 設定を適用する
				blurSizeRate:()=>{this._sizeRefresh();}, // サイズ適用
				changeQrCodeSize:()=>{this._changeQrCodeSize();}, // QRコードサイズ変更
			filters: {
					filPer: (value) => {
						return value + '%';
					}
				},
			}
		});
		
		
		this.card = jQuery('#post_card');
		this._sizeRefresh();
		
		this.data_url = this._loadDataUrlFromLs(); // ローカルから画像データURLスキームを取得しIMG要素にセットする。
	
		// ▽QRコード関連
		this.qrCodeElm = jQuery('#qr_code'); // QRコード要素
		this._makeQrCode(); // QRコードを作成
	}
	
	/**
	 * Ajaxを通してデータ取得を行う。
	 */
	_getBoxByAjax(){
		
	}
	
	
	/**
	 * 画像ファイルチェンジイベント
	 */
	changeImgFn(e){
		this._imgPreview(e);// 画像プレビューを表示
	}
	
	/**
	 * 画像プレビューを表示
	 * @param e ファイルアプロードのイベントオブジェクト
	 */
	_imgPreview(e){
		
		let fuElm = jQuery(e);
		
		let files = e.files;
		let oFile = files[0];
		
		// Converting from a file object to a data url scheme.Conversion process by the asynchronous.
		let reader = new FileReader();
		reader.readAsDataURL(oFile);

		// After conversion of the event.
		reader.onload = (evt) => {

			// accept属性を取得する
			let accept = fuElm.attr('accept');

			// accept属性が空もしくは画像系であるかチェックする
			if (accept == '' || accept.indexOf('image') >= 0){
				let data_url = reader.result;
				this.data_url = data_url;
				
				// IMG要素に画像を表示する
				let imgElm = jQuery("#img1");
				//imgElm.attr('src',reader.result);
				imgElm.attr('src', data_url);

			} 
		}
	}
	
	
	/**
	 * ローカルから画像データURLスキームを取得しIMG要素にセットする。
	 * @return 画像データURLスキーム
	 */
	_loadDataUrlFromLs(){
		let data_url = localStorage.getItem(this.ls_key_data_url);
		if(this._empty(data_url) || data_url == 'null'){
			jQuery('#img1').attr('src', 'img/def.jpg');
		}else{
			jQuery('#img1').attr('src', data_url);
		}
		
		return data_url;
	}
	
	
	/**
	 * ボックスを取得
	 */
	_getBox(){

		let box = this._getDefBox(); // デフォルトデータを取得する

		let boxLs = this._getBoxFromLs(); // ローカルストレージからデータを取得する

		jQuery.extend(true,box, boxLs); // マージ

		return box;

	}
	
	//■■■□□□■■■□□□
//	/**
//	 * データを取得
//	 */
//	_getData(){
//
//		let data = this._getDefEnt(); // デフォルトデータを取得する
//		let dataLs = this._getBoxFromLs(); // ローカルストレージからデータを取得する
//		
//		// マージ
//		if(!this._empty(dataLs)){
//			for(let key in data ){
//				if(dataLs[key] !== undefined){
//					data[key] = dataLs[key];
//				}
//			}
//		}
//
//		return data;
//	}
	
	/**
	 * デフォルトボックスを取得する
	 */
	_getDefBox(){
		
		let info = {
				edit_mode:0,
				email:'',
				active_data_index:0, // アクティブデータインデックス
				new_flg:1, // 新規フラグ 0:既存データ有り, 1:新規
		}
		
		let data = [];
		for(let i=0;i<4;i++){
			let ent = this._getDefEnt();
			if(i==0){
				ent = this._setSample(ent);
			}else{
				ent['midasi1'] = 'タイトル' + i;
			}
			data.push(ent);
		}
		
		let box = {
				info:info,
				data:data,
		}
		
		return box;
	}
	
	
	/**
	 * デフォルトエンティティを取得する
	 * @return {} デフォルトエンティティ
	 */
	_getDefEnt(){
		let ent = {
				card_width:0,
				card_height:0,
				card_mm_w:140,
				card_mm_h:90,
				size_rate:5, // 1mmあたりのcm
				post_card_class:'post_card_normal',
				qr_code_url:'https://wol.jw.org/',
				pr_code_size:100,
		};		
		ent['midasi1'] = "見出し1";
		ent['midasi2'] = "見出し2";
		ent['midasi3'] = "見出し3";
		
		ent['text1'] = "メッセージ1";
		ent['text2'] = "メッセージ2";
		ent['text3'] = "メッセージ3";
		ent['text4'] = "メッセージ4";
		
		return ent;
	}
	
	/**
	 * エンティティにサンプルをセットする。
	 */
	_setSample(ent){
		
		
		ent['qr_code_url'] = 'https://wol.jw.org/';
		ent['midasi1'] = "恐竜と聖書";
		ent['midasi2'] = "恐竜について聖書は何と述べていますか";
		ent['midasi3'] = "恐竜は他の動物から進化したのか";
		
		ent['text1'] = "JW.ORG® / エホバの証人の公式ウェブサイト";
		ent['text2'] = "聖書には，直接，恐竜に言及している箇所はありません。しかし，神様が「すべてのものを創造し」たと述べられているので，恐竜も神様が創造したと考えるのは理にかなっています。";
		ent['text3'] = "化石を研究すると，恐竜は徐々に進化したというより突然現われたことが分かります。これは，神様がすべての動物を創造されたとする聖書の記録と一致しています。一例として，詩編 146編6節は神様を，「天と地，海およびそれらの中にあるすべてのものの造り主」と呼んでいます。";
		ent['text4'] = "JW.ORG® / エホバの証人の公式ウェブサイト\nhttps://www.jw.org/";
		
		return ent;
	
	}
	
	
	
	
	
	
	/**
	 * サイズ更新
	 */
	_sizeRefresh(){
		let app = this.app;
		app.card_width = app.card_mm_w * app.size_rate;
		app.card_height = app.card_mm_h * app.size_rate;
		this.card.width(app.card_width);
		this.card.height(app.card_height);
	}
	
	/**
	 * 編集モードにする
	 */
	_clickEditMode(){
		this.app.edit_mode = 1;
		this.app.post_card_class = 'post_card_edit';
	}
	
	
	/**
	 * 設定適用
	 */
	_configApply(){
		this.app.edit_mode = 0; // 編集モードOFF
		this.app.post_card_class = 'post_card_normal';
		this._sizeRefresh(); // サイズ更新
		this._saveToLs(); // ローカルストレージへ保存
		this._makeQrCode(); // QRコードを作成
	}
	
	
	/**
	 * ローカルストレージから設定データを取得する
	 */
	_getBoxFromLs(){
		
		let data_json = localStorage.getItem(this.ls_key);
		if(this._empty(data_json)) return {};
		
		let data = JSON.parse(data_json);
		return data;
		
	}
	
	
	/**
	 * ローカルストレージへ保存
	 */
	_saveToLs(){

		// ▼ 全データのループ
		let data2 = {};
		for(let key in this.app._data){
			data2[key] = this.app[key];
		}
		var data_json = JSON.stringify(data2);
		localStorage.setItem(this.ls_key, data_json);
		
		
		// 画像データURLスキームをローカルストレージに保存
		localStorage.setItem(this.ls_key_data_url, this.data_url);
	}
	
	/**
	 * ローカルストレージキーを取得する
	 */
	_getLsKey(){
		// ローカルストレージキーを取得する
		let ls_key = location.href; // 現在ページのURLを取得
		ls_key = ls_key.split(/[?#]/)[0]; // クエリ部分を除去
		ls_key += '_PostCardMakerK_v2';
		return ls_key;
	}
	
	/**
	 * ローカルストレージキーを取得する(画像データURLスキーム用）
	 */
	_getLsKeyForDataUrl(){
		// ローカルストレージキーを取得する
		let ls_key = location.href; // 現在ページのURLを取得
		ls_key = ls_key.split(/[?#]/)[0]; // クエリ部分を除去
		ls_key += '_PostCardMakerK_img';
		return ls_key;
	}
	
	
	// Check empty.
	_empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	/**
	 * QRコードの作成
	 */
	_makeQrCode(){
		this.qrCodeElm.html(''); // 一旦リセット
		
		let qr_code_url = this.app.ent.qr_code_url;
		let pr_code_size = this.app.ent.pr_code_size;
		this.qrCodeElm.qrcode({
				width:pr_code_size,
				height:pr_code_size,
				text: qr_code_url,
		});
	}
	
	/**
	 * QRコードサイズ変更
	 */
	_changeQrCodeSize(){
		this._makeQrCode(); // QRコードの作成
	} 
	
	
	/**
	 * メールアドレス登録ボタンクリック（「次へ」ボタン）
	 */
	_regMailaddr(){
		
		let callBack = this._afterRegMailaddr.bind(this);// コールバック
		this._saveBoxByAjax(callBack); // Ajaxによるボックスのデータ保存
		
	}
	
	/**
	 * メールアドレス登録後の処理
	 */
	_afterRegMailaddr(){
		this.app.info.new_flg=0; // 既存にする
		console.log('_afterRegMailaddr22');//■■■□□□■■■□□□)
	}
	
	
	/**
	 * Ajaxによるボックスのデータ保存
	 * @param function callBack
	 */
	_saveBoxByAjax(callBack){
		// vue appのデータをボックスにセットする
		this.box.info = this.app.info;
		let active_data_index = this.box.info.active_data_index;
		this.box.data[active_data_index] = this.app.ent;

		// バックエンド側に送信するデータ
		let fd = new FormData(); // 送信フォームデータ
		let sendData = {
				box:this.box,
				csrf_token:this.csrf_token, // CSRFトークン
		}; 
		
		let json = JSON.stringify(sendData);
		fd.append( "key1", json );
		
		// CSRFトークンを送信フォームデータにセットする。
		let token = jQuery('#csrf_token').val();
		fd.append( "_token", token );
		
		jQuery.ajax({
			type: "post",
			url: 'ajax/save_box.php',
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done((str_json, type) => {

			console.log('レスポンスOK');
			let data = null;
			try{
				data =jQuery.parseJSON(str_json);//パース
			}catch(e){
				alert('データのエラー:' + str_json);
				console.log(str_json);
				this._err(str_json);
				return;
			}
			
			let res = '';
			for(let field in data){
				res += field + ' = ' + data[field] + '<br>';
			}
			
			// コールバックを実行
			if(callBack!=null){
				callBack();
			}
			

		}).fail((jqXHR, statusText, errorThrown) => {
			alert(statusText);
			console.log('通信エラー');
			this._err(jqXHR.responseText);
		});
	}
	
	/**
	 * エラーメッセージを表示
	 */
	_err(err_msg){
		let errElm = jQuery('#err_msg');
		errElm.show();
		errElm.html(err_msg);
	}
	
	
}



