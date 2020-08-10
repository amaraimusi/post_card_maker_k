
var pcmk; // PostCardMakerK.js
jQuery(()=>{
	
	
	pcmk = new PostCardMakerK();
	pcmk.init();

	
});



/**
 * 印刷
 */
function printout(){
	
	let card_html = jQuery('#post_card')[0].outerHTML;
	jQuery('#printout').html(card_html);
	//jQuery('body').hide();
	jQuery('#main').hide();
	window.print();
	jQuery('#main').show();
	jQuery('#printout').html('');
	
}