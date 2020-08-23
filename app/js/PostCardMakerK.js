
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

		this.card = jQuery('#post_card');
		this.csrf_token = jQuery('#csrf_token').val(); // CSRFトークン
		this.ls_key = this._getLsKey(); // ローカルストレージキー
		this.box = this._getBox();
		
		let email = this.box.info.email; // メールアドレスを取得する
		
		// メールアドレスが空なら新規の処理
		if(email == ''){
			this._showData(); // 画面にデータを表示
		}else{
			let afterGetBox = this._afterGetBox.bind(this); // Ajaxによるデータ取得後
			this._getBoxByAjax(afterGetBox); // Ajaxを通してデータ取得を行う。
		}
		
	}
	
	/**
	 * 画面にデータを表示
	 */
	_showData(){
		
		this.box = this._refreshSlots(this.box); // スロットをデータに合わせてリフレッシュする。
		let active_data_index = this.box.info.active_data_index; // アクティブデータインデックス
		let ent = this.box.data[active_data_index];
		
		this.app = new Vue({
			el: '#app1',
			data: {
				info:this.box.info,
				slots:this.box.slots,
				ent:ent,
				new_slot:'', // 新規追加スロット
			},
			methods: {
				regMailaddr:() => {this._regMailaddr();}, // メールアドレス登録ボタンクリック（「次へ」ボタン）
				clickEditMode:()=>{this._clickEditMode();}, // 編集モードにする
				configApply:()=>{this._configApply();}, // 設定を適用する
				blurSizeRate:()=>{this._sizeRefresh();}, // サイズ適用
				changeQrCodeSize:()=>{this._changeQrCodeSize();}, // QRコードサイズ変更
				addSlots:()=>{this._addSlots()}, // スロット新規追加
				changeSlot:()=>{this._changeSlot()}, // スロット変更
				clearLs:()=>{this._clearLs()}, // ローカルストレージクリア
			},
			filters: {
				filPer: (value) => {
					return value + '%';
				},
				filImgFn:(value) => {
					let u = jQuery.now(); // UNIXタイムスタンプ
					return 'img/' + value + '?v=' + u;
				},
			},
		});
		
		
		this._sizeRefresh();
		
		// ▽QRコード関連
		this.qrCodeElm = jQuery('#qr_code'); // QRコード要素
		this._makeQrCode(); // QRコードを作成
	}
	
	/**
	 * Ajaxを通してデータ取得を行う。
	 */
	_getBoxByAjax(callback){

		// バックエンド側に送信するデータ
		let fd = new FormData(); // 送信フォームデータ
		let sendData = {
				email:this.box.info.email,
				csrf_token:this.csrf_token, // CSRFトークン
		}; 
		
		let json = JSON.stringify(sendData);
		fd.append( "key1", json );
		
		jQuery.ajax({
			type: "post",
			url: 'ajax/get_box.php',
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done((str_json, type) => {

			let res = null;
			try{
				res = JSON.parse(str_json);
			}catch(e){
				alert('データのエラー :' + str_json);
				console.log(str_json);
				this._err(str_json);
				return;
			}

			// コールバックを実行
			if(callback!=null){
				callback(res);
			}
			

		}).fail((jqXHR, statusText, errorThrown) => {
			alert(statusText);
			console.log('通信エラー');
			this._err(jqXHR.responseText);
		});
		
	}
	
	
	/**
	 * Ajaxによるデータ取得後
	 */
	_afterGetBox(box){

		if(box != null){
			jQuery.extend(true,this.box, box); // マージ
		}
		
		
		this._showData(); // 画面にデータを表示
		
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
				imgElm.attr('src', data_url);

			} 
		}
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
	
	
	/**
	 * デフォルトボックスを取得する
	 */
	_getDefBox(){
		
		let info = {
				id:0,
				edit_mode:0,
				post_card_class:'post_card_normal',
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
		
		// スロットリスト
		let slots = [];
		for(let i in data){
			let ent = data[i];
			slots.push(ent.midasi1);
		}
		
		let box = {
				info:info,
				slots:slots,
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
				qr_code_url:'https://wol.jw.org/',
				pr_code_size:100,
				img_fn:'def.jpg',
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
		app.ent.card_width = app.ent.card_mm_w * app.ent.size_rate;
		app.ent.card_height = app.ent.card_mm_h * app.ent.size_rate;
		this.card.width(app.ent.card_width);
		this.card.height(app.ent.card_height);
	}
	
	/**
	 * 編集モードにする
	 */
	_clickEditMode(){
		this.app.info.edit_mode = 1;
		this.app.info.post_card_class = 'post_card_edit';
	}
	
	
	/**
	 * 設定適用
	 */
	_configApply(){
		
		this.app.info.edit_mode = 0; // 編集モードOFF
		this._sizeRefresh(); // サイズ更新
		this._saveToLs(); // ローカルストレージへ保存
		this._makeQrCode(); // QRコードを作成

		let afterCofigApply = this._afterCofigApply.bind(this); // 設定適用Ajax後処理
		this._saveBoxByAjax(afterCofigApply);
		
		
	}
	
	
	/**
	 * 設定適用Ajax後処理
	 */
	_afterCofigApply(){
		this.app.info.post_card_class = 'post_card_normal';
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
		
		// メールアドレスを取得する
		let email = this.app.info.email;
		
		// メール存在チェック
		this._mailExitCheck(email, 
				()=>{
					// メールがDBに存在する場合の処理
					this._getBoxByAjax((box)=>{
							if(box != null){
								jQuery.extend(true, this.box, box); // マージ
								this.box = this._refreshSlots(this.box); // スロットをデータに合わせてリフレッシュする。
								let active_data_index = this.box.info.active_data_index; // アクティブデータインデックス
								this.app.ent = this.box.data[active_data_index];
								this.app.info = this.box.info;
								this.app.slots = this.box.slots;
							}
							this.app.info.new_flg=0; // 既存状態にする。（ポストカード画面の表示）
							this._sizeRefresh(); // サイズ更新
					});
					
				},
				()=>{
					// メールがDBに存在しない場合の処理
					let callBack = this._afterRegMailaddr.bind(this);// コールバック
					this._saveBoxByAjax(callBack); // Ajaxによるボックスのデータ保存
				}
		); 

	}
	
	
	/**
	 * メール存在チェック
	 * 
	 * @note
	 * DBに対して入力したメールが存在するかチェックする。
	 * 
	 * @param string email メールアドレス
	 * @param function メールがDBに存在する場合に実行するコールバック
	 * @param function メールがDBに存在しない場合に実行するコールバック
	 */
	_mailExitCheck(email, yesMailCallback, noMailCallBack){
		
		// バックエンド側に送信するデータ
		let fd = new FormData(); // 送信フォームデータ
		let sendData = {
				email:this.box.info.email,
				csrf_token:this.csrf_token, // CSRFトークン
		}; 
		
		let json = JSON.stringify(sendData);
		fd.append( "key1", json );
		
		jQuery.ajax({
			type: "post",
			url: 'ajax/mail_exit_check.php',
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done((str_json, type) => {

			let res = null;
			try{
				res = JSON.parse(str_json);
			}catch(e){
				alert('データのエラー :' + str_json);
				console.log(str_json);
				this._err(str_json);
				return;
			}
			
			// コールバックの実行
			if(res.email_flg==true){
				yesMailCallback();
			}else{
				noMailCallBack();
			}

		}).fail((jqXHR, statusText, errorThrown) => {
			alert(statusText);
			console.log('通信エラー');
			this._err(jqXHR.responseText);
		});
	}
	
	/**
	 * メールアドレス登録後の処理
	 */
	_afterRegMailaddr(){
		this.app.info.new_flg=0; // 既存にする
		
		this._saveToLs(); // ローカルストレージへ保存

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
		
		// ファイル要素をセット
		let fileElm = jQuery('#img_fn');
		let files = fileElm.prop("files");
		if(files != null){
			if(files[0] != null) {
				fd.append( "imgFile", files[0]);
			}
		}
		
		jQuery.ajax({
			type: "post",
			url: 'ajax/save_box.php',
			data: fd,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,

		}).done((str_json, type) => {

			let res = null;
			try{
				res =jQuery.parseJSON(str_json);//パース
			}catch(e){
				alert('データのエラー:' + str_json);
				console.log(str_json);
				this._err(str_json);
				return;
			}
			
			// idをセット
			let id = res.id;
			this.app.info.id = id;

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
	
	
	/**
	 * スロット新規追加
	 */
	_addSlots(){

		let new_slot = this.app.new_slot; // 新規追加スロット
		
		 // 新規追加スロットの名称が空なら何もしない。
		if(new_slot.trim() == ''){
			alert('スロット名を入力してください。');
			return;
		}
		
		let newEnt = this._getDefEnt(); // デフォルトエンティティを取得
		newEnt.midasi1 = new_slot; // 新規追加ストっと名を見出し1にセットする。
		
		this.box.data.push(newEnt);
		this.app.slots.push(new_slot);
		
		alert('スロット選択（データ選択）の末尾に新しいスロットを追加しました。');
		
	}
	
	/**
	 * スロット変更
	 */
	_changeSlot(){

		let active_data_index = this.app.info.active_data_index; // アクティブデータインデックス
		let ent = this.box.data[active_data_index];
		this.app.ent = ent;
		
	}
	
	/**
	 * スロットをデータに合わせてリフレッシュする。
	 * @param {} box ボックス
	 * @return {} スロットリストを更新後のbox
	 */
	_refreshSlots(box){
		let data = box.data;
		let slots = [];
		for(let i in data){
			let ent = data[i];
			slots.push(ent.midasi1);
		}
		box['slots'] = slots;
		return box;
	}
	
	/**
	 * ローカルストレージクリア
	 */
	_clearLs(){
		
		let ls_key = this._getLsKey(); // ローカルストレージキーを取得する
		localStorage.removeItem(ls_key); // ローカルストレージクリア
		alert('キャッシュをクリアしました。');
		
	}
	
}



