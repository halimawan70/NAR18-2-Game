function show(el,op,func){
    op = op || 1;
    el.css("z-index",99);
    el.animate({
        opacity:op,
        zIndex:99,
    },1000,func);
}

function hide(el,func){
    el.animate({
        opacity:0,
        zIndex:-1,
    },500,func);
}

$(document).ready(function(){
    function init(){
        $("#wrapper-container,.modal").css({"opacity":0,"z-index":-1});
        show($("#start-modal"),0.8);
    }
    function start(){
        if(gameState != RUNNING){
            gameState = RUNNING;
            initialize();
            newBlock();
            render();
            setTimeout(tick,750);    
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