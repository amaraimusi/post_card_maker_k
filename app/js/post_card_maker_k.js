
var pcmk; // PostCardMakerK.js
jQuery(()=>{
	
	
	pcmk = new PostCardMakerK();
	pcmk.init();

	
});


/**
 * 印刷
 */
function printPreview(){

	window.scrollTo(0, 0); // スクロールをリセットする必要がある。
	let targetElm = jQuery("#post_card");
	let w = targetElm.outerWidth();
	let h =  targetElm.outerHeight();

	html2canvas(targetElm[0],{width:w,height:h,scrollX:-8.5,scrollY:0}).then(canvas => {
		
		jQuery('#print_preview').show();
		jQuery('#config_div').hide();
		
		let imgElm = jQuery('#img2');
		imgElm.width(w);
		imgElm.height(h);
		imgElm[0].src = canvas.toDataURL("image/png");

		targetElm.hide();
	});
	
//	html2canvas(document.getElementById("test1"), {
//				onrendered: function (canvas) {
//					// コンテンツの画像化が完了したら以下の処理を行います。
//					
//					// コンテンツの画像データを取得します。
//						var dataURI = canvas.toDataURL("image/jpeg");
//						
//						// ｊｓPDFを生成し、画像データを渡します。
//						var pdf = new jsPDF();
//						pdf.addImage(dataURI, 'JPEG', 0, 0);
//						
//						// とりこんだ画像データからレンダリングデータを作成し、PDFプレビュー画面を表示します。
//						var renderString = pdf.output("datauristring");
//						$("iframe").attr("src", renderString);
//				}
//		});
	
}

/**
 * 通常モードに戻る
 */
function returnNormalMode(){
	jQuery("#post_card").show();
	jQuery('#config_div').show();
	jQuery('#print_preview').hide();
	
}


/**
 * 印刷
 */
function printoutOld(){
	
	let card_html = jQuery('#post_card')[0].outerHTML;
	jQuery('#printout').html(card_html);
	//jQuery('body').hide();
	jQuery('#main').hide();
	window.print();
	jQuery('#main').show();
	jQuery('#printout').html('');
	
}

/**
 * 画像ファイルチェンジイベント
 */
function changeImgFn(e){
	pcmk.changeImgFn(e);
}


function downloadImg2(){

	var u = Math.floor(jQuery.now() / 1000);
	let fn = 'pcmk' + u + '.png';
	
	var a = document.createElement('a');
	a.href = $('#img2')[0].src;
	a.download = fn;
	a.click();
	

}

















