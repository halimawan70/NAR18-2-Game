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
	}

	function showVideo(){
		var el = $("#wrap-video");
		el.css({"opacity":"0","display":"block"});
		el.animate({opacity:1},500);
	}

	function hideVideo(){
		var el = $("#wrap-video");
		el.css({"opacity":"1","display":"block"});
		el.animate({opacity:0},500,function(){
			el.css("display","none");	
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
		$('#start-game').animate({opacity:0},{
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
	$('#start-game').click(startGame);

	$("#close").click(showHideVideo);

	initHTML();
    slideLeftRight();

});