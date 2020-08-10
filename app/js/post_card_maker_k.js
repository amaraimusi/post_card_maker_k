
var pcmk; // PostCardMakerK.js
jQuery(()=>{
	
	
	pcmk = new PostCardMakerK();
	pcmk.init();
	

//	var fileuploadImg = new FileuploadImg();■■■□□□■■■□□□
	//■■■□□□■■■□□□
//	$('#img_fn').change(function(e) {
//		console.log('test');//■■■□□□■■■□□□)
//
//		
//	});
	
});


//■■■□□□■■■□□□
///**
// * サイズ適用
// */
//function configApply(){
//
//	pcmk.sizeRefresh();
//}

// ■■■□□□■■■□□□
///**
// * 編集モードにする
// */
//function editMode(){
//	pcmk.clickEditMode();
//}

/**
 * 印刷
 */
function printout(){
	
	let card_html = jQuery('#post_card')[0].outerHTML;
	jQuery('body').append(card_html);
	//jQuery('body').hide();
	jQuery('#main').hide();
	window.print();
	jQuery('#main').show();

	//■■■□□□■■■□□□
//	html2canvas(document.querySelector("#post_card")).then(canvas => {
//	    //document.body.appendChild(canvas);
//		var data_url = canvas.toDataURL();
//		//$('#a_dl').attr('href',data_url);
//		//window.open(imgData);
//		//window.open("images/"+ imgData, "imgwindow");
//		document.getElementById("test_img").src = data_url;
//	    
//	    //jQuery('body').hide();
//	});
	
	
//    var scaleBy = 5;
//    var w = 529.133864;
//    var h = 340.157484;
//    var div = document.querySelector('#post_card');
//    var canvas = document.createElement('canvas');
//    canvas.width = w * scaleBy;
//    canvas.height = h * scaleBy;
//    canvas.style.width = w + 'px';
//    canvas.style.height = h + 'px';
//    var context = canvas.getContext('2d');
//    context.scale(scaleBy, scaleBy);
//	
//    html2canvas(div, {
//        canvas:canvas,
//        onrendered: function (canvas) {
//        	
//
//            
//			var imgData = canvas.toDataURL();
//			//window.open("images/"+ imgData, "imgwindow");
//			document.getElementById("test_img").src = imgData;
//        }
//    });
    
	
//	html2canvas(document.getElementById("post_card"),{
//		dpi: 144,
//		onrendered: function(canvas){
//
//			//imgタグのsrcの中に、html2canvasがレンダリングした画像を指定する。
//			var imgData = canvas.toDataURL();
//			//window.open("images/"+ imgData, "imgwindow");
//			document.getElementById("test_img").src = imgData;
//		}
//	});
	
	
	
	
	
	
//	let card_html = jQuery('#post_card')[0].outerHTML;
//	jQuery('#print_div').html(card_html);
//	jQuery('#main').hide();
//	window.print();
//	jQuery('#main').show();
	
//	html2canvas(element, {
//	    dpi: 144,
//	    onrendered: myRenderFunction
//	});
//	console.log('test1');//■■■□□□■■■□□□)
	//HTML内に画像を表示
//	html2canvas(document.getElementById("post_card"),{
//		dpi: 144,
//		onrendered: function(canvas){
//			
//		    var context = canvas.getContext('2d');
//		    context.scale(2500, 2000);
//		    
//			//imgタグのsrcの中に、html2canvasがレンダリングした画像を指定する。
//			var imgData = canvas.toDataURL();
//			//window.open("images/"+ imgData, "imgwindow");
//			document.getElementById("test_img").src = imgData;
//		}
//	});
	
	
	
	
	
}