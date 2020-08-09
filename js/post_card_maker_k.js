
var pcmk; // PostCardMakerK.js
jQuery(()=>{
	
	pcmk = new PostCardMakerK();
	pcmk.init();
	
});


/**
 * サイズ適用
 */
function configApply(){

	pcmk.sizeRefresh();
}

//■■■□□□■■■□□□
//var app;
//var m_card;
//
//function init(){
//	
//	
//	let box = {
//			card_width:0,
//			card_height:0,
//			card_mm_w:140,
//			card_mm_h:90,
//			size_rate:3.7795276, // 1mmあたりのcm
//	};
//	
////	box['card_width'] = box.card_mm_w * box.size_rate;
////	box['card_height'] = box.card_mm_h * box.size_rate;
////	
////	console.log(box);//■■■□□□■■■□□□)
////	
//	
//	app = new Vue({
//		el: '#app1',
//		data: box,
//		methods: {
//			blurSizeRate:()=>{
//				sizeRefresh();
//				console.log('test');//■■■□□□■■■□□□)
//			}
//		}
//	})
//	
//	sizeRefresh();
//	m_card = jQuery('#post_card');
////	m_card.width(app.card_width);
////	m_card.height(app.card_width);
//	
//	
//}
//
//function configApply(){
//	
//	sizeRefresh();
//}
//
//function sizeRefresh(){
//	
//	app.card_width = app.card_mm_w * app.size_rate;
//	app.card_height = app.card_mm_h * app.size_rate;
//	m_card = jQuery('#post_card');
//	m_card.width(app.card_width);
//	m_card.height(app.card_height);
//}