$(document).ready(function(){
	
	function initLayout(){
		$("#leftside,#midside,#rightside").height($(window).height()-20);
		var leftsep = $("#container").height()-($("#wrap-controller").height()+$("#wrap-register").height());
		
		$("#rightside .wrap-content-nar").height($("#container").height() - $("#rightside .title").outerHeight());
		$("#rightside .content-nar").height($("#rightside .wrap-content-nar").outerHeight() - $("#rightside .info-nar").outerHeight() - 80);
		
		if(leftsep >= 10)
			$("#leftside-separator").height(leftsep);
	}

	initLayout();

});