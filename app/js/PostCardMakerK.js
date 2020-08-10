
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

		this.ls_key = this._getLsKey(); // ローカルストレージキー
		this.ls_key_data_url = this._getLsKeyForDataUrl(); // ローカルストレージキー(データURLスキーム）
		let data = this._getData();

		this.app = new Vue({
			el: '#app1',
			data: data,
			methods: {
				clickEditMode:()=>{this._clickEditMode();}, // 編集モードにする
				configApply:()=>{this._configApply();}, // 設定を適用する
				blurSizeRate:()=>{this._sizeRefresh();}, // サイズ適用
			filters: {
					filPer: (value) => {
						return value + '%';
					}
				},
			}
		});
		
		
		this.card = jQuery('#post_card');
		this._sizeRefresh();
		
		// 画像アップロードイベント
		jQuery("#img_fn").change((e) =>{
			this._imgPreview(e);// 画像プレビューを表示
		});
		
		this.data_url = this._loadDataUrlFromLs(); // ローカルから画像データURLスキームを取得しIMG要素にセットする。
		
	}
	
	/**
	 * 画像プレビューを表示
	 * @param e ファイルアプロードのイベントオブジェクト
	 */
	_imgPreview(e){
		// ファイルアップロードの要素を取得するテスト
		let fuElm = jQuery(e.currentTarget);
		//let id = fuElm.attr('id');
		console.log('B1');//■■■□□□■■■□□□)
		let files = e.target.files;
		let oFile = files[0];
		
		// Converting from a file object to a data url scheme.Conversion process by the asynchronous.
		let reader = new FileReader();
		reader.readAsDataURL(oFile);

		// After conversion of the event.
		reader.onload = (evt) => {
console.log('B2');//■■■□□□■■■□□□)
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
	 * データを取得
	 */
	_getData(){

		let data = this._getDefData(); // デフォルトデータを取得する
		let dataLs = this._getDataFromLs(); // ローカルストレージからデータを取得する
		
		// マージ
		if(!this._empty(dataLs)){
			for(let key in data ){
				if(dataLs[key] !== undefined){
					data[key] = dataLs[key];
				}
			}
		}

		return data;
	}
	
	/**
	 * デフォルトデータを取得する
	 * @return {} デフォルトデータ
	 */
	_getDefData(){
		let data = {
				edit_mode:0,
				card_width:0,
				card_height:0,
				card_mm_w:140,
				card_mm_h:90,
				size_rate:5, // 1mmあたりのcm
				post_card_class:'post_card_normal',
		};
		
		data['midasi1'] = "info";
		data['midasi2'] = "恐竜について聖書は何と述べていますか";
		data['midasi3'] = "恐竜は他の動物から進化したのか";
		
		data['text1'] = "JW.ORG® / エホバの証人の公式ウェブサイト";
		data['text2'] = "聖書には，直接，恐竜に言及している箇所はありません。しかし，神様が「すべてのものを創造し」たと述べられているので，恐竜も神様が創造したと考えるのは理にかなっています。";
		data['text3'] = "化石を研究すると，恐竜は徐々に進化したというより突然現われたことが分かります。これは，神様がすべての動物を創造されたとする聖書の記録と一致しています。一例として，詩編 146編6節は神様を，「天と地，海およびそれらの中にあるすべてのものの造り主」と呼んでいます。";
		
		return data;
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
	}
	
	
	/**
	 * ローカルストレージから設定データを取得する
	 */
	_getDataFromLs(){
		
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
		ls_key += '_PostCardMakerK';
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
}



