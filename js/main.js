$(document).ready(function(){
	
	function tick(){
	    if(gameState == GAMEOVER){
	    	showHideVideo();
	    	gameState=NOT_STARTED;
	    }
	    else if(gameState == RUNNING || gameState == ON_PROCESS){
	        popLine();
	        moveDown();
	        setTimeout(tick,fps);
	    }
	    else return;
	}

	function initHTML(){
		$("#wrap-video").css("display","none");
		slideLeftRight();
	}

	function disableMain(param){
		if(param)
			$("#main").attr("disabled","disabled");
		else
			$("#main").removeAttr("disabled");
	}

	function showButtonStart(){
		disableMain(true);
		reBoard();
		var el = $("#open-start");
		el.css({"opacity":"0","display":"block"});
		el.animate({opacity:0.9},500);
	}

	function hideButtonStart(){
		var el = $("#open-start");
		el.css({"opacity":"0.9","display":"block"});
		el.animate({opacity:0},500,function(){
			el.css('display','none');
			disableMain(false);
		});
	}

	function showVideo(){
		var el = $("#wrap-video");
		el.css({"opacity":"0","display":"block"});
		el.animate({opacity:0.9},500);
		disableMain(true);
	}

	function hideVideo(){
		showButtonStart();
		var el = $("#wrap-video");
		el.css({"opacity":"0.9","display":"block"});
		el.animate({opacity:0},500,function(){ 
			el.css("display","none"); 
			disableMain(false);
		});	

	}

	function showHideVideo(){
		var el = $("#wrap-video");
		if(el.css("display") == "none" && gameState == GAMEOVER)showVideo();
		else hideVideo();
	}

	function slideLeftRight(){
		setTimeout(function(){
	        $('#left').addClass('anim-left');
	        $('#right').addClass('anim-right');    
	        
	        setTimeout(function(){
	        	$('#left').remove();
	        	$('#right').remove();
	       	},2000);

    	},1000);	
	}

	function startGame(){
		$('#open-start').animate({opacity:0},{
			duration:500,
			complete:function(){
				gameState = RUNNING;
				initialize();
				newBlock();
				render();
				setTimeout(tick,750);
				$('#open-start').css("display","none");
			}
		}); 
	}

	//game started
	function main(){
		$('#start-game').click(startGame);
		$("#close").click(showHideVideo);

		initHTML();	
	}
	
	main();

});