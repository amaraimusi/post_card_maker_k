
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
		let box = {
				card_width:0,
				card_height:0,
				card_mm_w:140,
				card_mm_h:90,
				size_rate:3.7795276, // 1mmあたりのcm
		};
		

		this.app = new Vue({
			el: '#app1',
			data: box,
			methods: {
				blurSizeRate:()=>{
					this._sizeRefresh();
				}
			}
		})
		
		this.card = jQuery('#post_card');
		this._sizeRefresh();
	}
	
	
	/**
	 * 設定適用
	 */
	configApply(){
		
		this._sizeRefresh();
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
}



