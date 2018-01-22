var contentTitle = ["Requirements","Benefits","Initial Test"];
var contentNar = [];
var currContent = 0;

function show(el,op,func,s){
    s = s || 1;
    op = op || 1;
    el.css("z-index",99);
    el.animate({
        opacity:op,
        zIndex:99,
    },s,func);
}

function hide(el,func){
    el.animate({
        opacity:0,
        zIndex:-1,
    },500,func);
}

$(document).ready(function(){

    function doSlideInfo(){
        contentNar[currContent].css("display","block");
        show(contentNar[currContent],1,function(){},1500);
        $("#info-title-nar").css("opacity","0");
        $("#info-title-nar").text(contentTitle[currContent]);
        show($("#info-title-nar"),1,function(){},1500);
    }
    function init(){
        $("#info-title-nar").text(contentTitle[currContent]);
        
        $(".wrap-content-info").each(function(){
            contentNar.push($(this));
        });

        setInterval(function(){
            $(".wrap-content-info").css({"display":"none","opacity":0});
            if(gameState != RUNNING){
                return;
            }
            if(currContent >= contentNar.length-1)
                currContent = 0;
            else currContent++;
            doSlideInfo();
        },10000);
    }
    function start(){
        if(gameState != RUNNING){
            gameState = RUNNING;
            initialize();
            newBlock();
            render();
            setTimeout(tick,750);    
            doSlideInfo();
        }
    }

    function tick(){
        if(gameState == GAMEOVER){
            initialize();
            $("#start-modal").css("display","block");
            show($("#start-modal"));
        }
        else if(gameState == RUNNING || gameState == ON_PROCESS){
            popLine();
            moveDown();
            setTimeout(tick,fps);
        }
        else return;
    }

    $("#btn-start").click(function(){
        hide($("#start-modal"),function(){
            $("#start-modal").css("display","none");
            show($("#wrapper-container"),1,start);
        });
    });

    function main(){
        init();
    }
    main();
});