/**
	 * ファイルアップロード＆プレビュー
	 * @since 202-8-10
	 * @version 0.0.9
	 * @lisence MIT
	 * @auther kenji uehara
	 */
	class FileuploadImg{
	
		constructor(param){
			
			jQuery("#img_fn").change((e) =>{
	console.log('アップロードイベント');//■■■□□□■■■□□□)
				this.test(); // thisは当クラスを指しているならメソッドを呼び出せる。
				
				this.imgPreview(e);// 画像プレビューを表示
	
			});
			
//			$('#img_fn').change(function(e) {
//				console.log('test');//■■■□□□■■■□□□)
//				//ファイルオブジェクト配列を取得（配列要素数は選択したファイル数を表す）
//				var files = e.target.files;
//				var oFile = files[0];
//		
//				var reader = new FileReader();
//				reader.readAsDataURL(oFile); // データURLスキーム取得処理を非同期で開始する
//			
//				// データURLスキームを取得後に実行される処理
//				reader.onload = function(evt) {
//					// img要素にデータURLスキームをセットし、画像表示する。
//					$('#img1').attr('src',reader.result);
//				}
//			});
		}
		
		test(){
			this.output('thisによるメソッドの呼び出しテスト。');
		}
		
		output(msg){
			console.log(msg);
			jQuery("#res").append(msg + '<br>');
		}
	
		/**
		 * 画像プレビューを表示
		 * @param e ファイルアプロードのイベントオブジェクト
		 */
		imgPreview(e){
			// ファイルアップロードの要素を取得するテスト
			var fuElm = jQuery(e.currentTarget);
			var id = fuElm.attr('id');
			this.output('id = ' + id);
			
			var files = e.target.files;
			var oFile = files[0];
			
			// Converting from a file object to a data url scheme.Conversion process by the asynchronous.
			var reader = new FileReader();
			reader.readAsDataURL(oFile);
	
			// After conversion of the event.
			reader.onload = (evt) => {
	
				// accept属性を取得する
				var accept = fuElm.attr('accept');
	
				// accept属性が空もしくは画像系であるかチェックする
				if (accept == '' || accept.indexOf('image') >= 0){
	
					// IMG要素に画像を表示する
					var imgElm = jQuery("#img1");
					imgElm.attr('src',reader.result);
	
				} 
			}
		}
		
		
	}