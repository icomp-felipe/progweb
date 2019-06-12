icomp@lab138c ~ $  ssh master@10.208.200.154
master@10.208.200.154's password: 
Welcome to Linux Mint 18.1 Serena (GNU/Linux 4.4.0-53-generic x86_64)

 * Documentation:  https://www.linuxmint.com
Last login: Wed Jun 12 17:17:16 2019 from 10.208.200.145
master@icomp-pc ~ $ 
master@icomp-pc ~ $ 
master@icomp-pc ~ $ cd Área\ de\ Trabalho/progweb/
master@icomp-pc ~/Área de Trabalho/progweb $ ls
CSS1  CSS3   DOM1  DOM3  JS2  JS4      README.md  tRexSails
CSS2  dadas  DOM2  JS1   JS3  prova01  tRex
master@icomp-pc ~/Área de Trabalho/progweb $ cd tRex
master@icomp-pc ~/Área de Trabalho/progweb/tRex $ ls
css  favicon.ico  index.html  js  README.md
master@icomp-pc ~/Área de Trabalho/progweb/tRex $ cd js/
master@icomp-pc ~/Área de Trabalho/progweb/tRex/js $ l
trex.js
master@icomp-pc ~/Área de Trabalho/progweb/tRex/js $ cat trex.js 
(function () {

    const FPS = 300;
    const PROB_NUVEM = 5;
    var PROB_CACTO=5;
    var PROB_PASSARO=5;
    var aumentaProb=0;
    var gameLoop;
    var gameStatus;
    var typeStatus=['inicio','jogo','pause','gameover'];
    var deserto;
    var dino;
    var nuvens = [];
    var cactos = [];
    var passaros = [];
    var high_score = 0;
    var typeCactos=['cactoP1','cactoP2','cactoP3','cactoG1','cactoG2','cactoG4'];
    var n_pont = 0;
    var qtd_frames_velocity=0;
    var qtd_frames_pontos=0;
    var velocity=0.06;
    var framesCactos=0;
    var framesObs=0;
    var framesPassaros=0;

    function init () {
        deserto = new Deserto();
        dino = new Dino();
        gameStatus = typeStatus[0];
        pont = new Pontuacao(n_pont);
        gameOver = new GameOver();
        gameStatus=typeStatus[0];
        document.body.style.backgroundColor="white";
        //pont.setSprite(pont.sprites[0]);
    }
    
    window.addEventListener("keydown", function (e) {
        if (e.key == "ArrowUp" && dino.status==0){
            gameLoop = setInterval(run, 1000/FPS);
            backLoop = setInterval(Background,60000)
            gameStatus='jogo';
            dino.status = 2;

        }else if(e.key=="ArrowUp" && dino.status==1){
            dino.status=2;
            
        }else if(e.key=="ArrowDown" && dino.status==1){
            dino.status=4

        }
        else if(e.key=="p"){
            console.log("pause");
            if(gameStatus=='jogo'){
                clearInterval(gameLoop);
                clearInterval(backLoop);
                gameStatus=typeStatus[2];
            }else if(gameStatus=='pause'){
                gameLoop = setInterval(run, 1000/FPS);
                backLoop = setInterval(Background,60000);
                gameStatus='jogo';
                
            }
        }

    });
    window.addEventListener('keyup',function(e){
        if(e.key=='ArrowDown' && dino.status==4){
            dino.status=1;
        }
    });

    function Background(){
        
        if(document.body.style.backgroundColor=='white'){
            document.body.style.backgroundColor='black';
        }else{
            document.body.style.backgroundColor='white';
        }
    }

    function Deserto () {
        this.element = document.createElement("div");
        this.element.className = "deserto";
        document.body.appendChild(this.element);

        this.chao = document.createElement("div");
        this.chao.className = "chao";
        this.chao.style.backgroundPositionX = "0em";
        this.element.appendChild(this.chao);
    }

    Deserto.prototype.mover = function() {
        
        this.chao.style.backgroundPositionX = (parseFloat(this.chao.style.backgroundPositionX) - velocity) + "em";
    }

    function Dino () {
        
        this.status = 0; // 0: parado; 1:correndo; 2:subindo; 3: descendo; 4: agachado ;5: morto
        this.alturaMaxima = "5em";
        this.element = document.createElement("div");
        this.element.className = "dino dinoParado";
        this.element.style.bottom = "0em";

        deserto.element.appendChild(this.element);
    }   
    
    Dino.prototype.correr = function () {
      
        if(this.status==0){
            this.element.className = "dino dinoParado";
        }
        if (this.status == 1) {
            this.element.className = (this.element.className == "dino dinoCorrer1")?"dino dinoCorrer2":"dino dinoCorrer1";
        }
        else if (this.status == 2) {
            
            
            this.element.className = "dino dinoPulando"
            this.element.style.bottom = (parseFloat(this.element.style.bottom) + velocity) + "em";
            if (this.element.style.bottom > this.alturaMaxima) this.status = 3;
        }
        else if (this.status == 3) {
            
            this.element.style.bottom = (parseFloat(this.element.style.bottom) - velocity) + "em";
            if (parseFloat(this.element.style.bottom)<=0){
                this.element.style.bottom="0em";
                this.status = 1;
            }
        }else if(this.status==4){
            this.element.className = (this.element.className == "dino dinoAgachado1")?"dino dinoAgachado2":"dino dinoAgachado1"
        }
        else if(this.status==5){
            this.element.className ="dino dinoMorto";
        }
    }

    function Nuvem () {
        this.element = document.createElement("div");
        this.element.className = "nuvem";
        this.element.style.right = "0px";
        this.element.style.top = Math.floor(Math.random()*120) + "px";
        deserto.element.appendChild(this.element);
    }

    Nuvem.prototype.mover = function () {
        this.element.style.right = (parseFloat(this.element.style.right) + velocity/2) + "em";
    }

    function Pontuacao(pont){
        
        this.numbers=['-483px','-493px','-503px','-513px','-523px','-533px','-543px','-553px','-563px','-573px','-584px','-594px'];
        

        this.a = this.setPontuation("pont unidades",0);
        this.b=this.setPontuation("pont dezenas",0);
        this.c=this.setPontuation("pont centenas",0);
        this.d= this.setPontuation("pont milhares",0);
        this.e = this.setPontuation("pont dezmilhares",0);

        if(pont!=0){

            this.setHI(pont);
            
        }

    }
    Pontuacao.prototype.setHI = function(pont){
            output=[];
            s_pont = pont.toString();
            for (var i = 0, len = s_pont.length; i < len; i += 1) {
                output.unshift(+s_pont.charAt(i));
            }
            this.f = this.setPontuation("pont unidadesHI",output[0]);
            this.g = this.setPontuation("pont dezenasHI", output[1]);
            this.h = this.setPontuation("pont centenasHI",output[2]);
            this.i = this.setPontuation("pont milharesHI",output[3]);
            this.j = this.setPontuation("pont dezmilharesHI",output[4]);
            this.k = this.setPontuation("pont pontH",10);
            this.l = this.setPontuation("pont pontI",11)
    }
    Pontuacao.prototype.setPontuation = function(classCss,indNumbers){
        var element = document.createElement("div");
        element.className=classCss;
        if(indNumbers!=undefined){
            element.style.backgroundPositionX = this.numbers[indNumbers];
        }else{
            element.style.backgroundPositionX = this.numbers[0];
        }
        deserto.element.appendChild(element);
        return element;
    } 
    Pontuacao.prototype.setNumber = function(element,num){
        element.style.backgroundPositionX = this.numbers[num];
    }

    function Cactos(type){
        this.cacto = document.createElement("div");
        this.cacto.className='cacto '+type;
        this.cacto.style.right="0em";
        deserto.element.appendChild(this.cacto);
    }
    
    Cactos.prototype.mover = function(){
        this.cacto.style.right = (parseFloat(this.cacto.style.right) + velocity) + "em";
        
    }
    Cactos.prototype.colisao =  function () {
        rect1 = dino.element.getBoundingClientRect();
        rect2 = this.cacto.getBoundingClientRect();
        var overlap=false;
        if(this.cacto.className == "cacto cactoP1" || this.cacto.className=="cacto cactoP2" || this.cacto.className=="cacto cactoP3" || this.cacto.className=="cacto cactoG1"){
            if(dino.status==1 || dino.status==4){
                cond1 = rect1.right < (rect2.left+10);
                cond2 = rect1.left > rect2.right;
                cond3 = rect1.bottom < (rect2.top);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 );
            
               // console.log('status1 -',cond1,cond2,cond3,cond4);
            }else if(dino.status==2) {
                cond1 = rect1.right < (rect2.left+25);
                cond2 = rect1.left > rect2.right;
                cond3 = rect1.bottom < (rect2.top);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 ); 
                //console.log('status2 -',cond1,cond2,cond3,cond4);
            }else if(dino.status==3) {
                cond1 = rect1.right < (rect2.left+20);
                cond2 = rect1.left > rect2.right-10;
                cond3 = rect1.bottom < (rect2.top+5);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 ); 
               // console.log('status3 -',cond1,cond2,cond3,cond4);
            }
            
        }
        if(this.cacto.className == "cacto cactoG2" || this.cacto.className=="cacto cactoG4"  ){
            if(dino.status==1 || dino.status==4){
                cond1 = rect1.right < (rect2.left+10);
                cond2 = rect1.left > rect2.right;
                cond3 = rect1.bottom < (rect2.top);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 );
            
              //  console.log('status1 -',cond1,cond2,cond3,cond4);
            }else if(dino.status==2) {
                cond1 = rect1.right < (rect2.left+28);
                cond2 = rect1.left > rect2.right;
                cond3 = rect1.bottom < (rect2.top);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 ); 
                //console.log('status2 -',cond1,cond2,cond3,cond4);
            }else if(dino.status==3) {
                cond1 = rect1.right < (rect2.left+20);
                cond2 = rect1.left > rect2.right+10;
                cond3 = rect1.bottom < (rect2.top+30);
                cond4 = rect1.top > rect2.bottom;
                overlap = ! (cond1 || cond2 || cond3 || cond4 ); 
                //console.log('status3 -',cond1,cond2,cond3,cond4);
            }
        }
      
      

        
        if(overlap==true){
                gameStatus=typeStatus[3];
                dino.status=5;
               // console.log(pont);
                if(n_pont > high_score){
                    high_score=n_pont;
                }
                pont.setHI(high_score);
                gameOver.mostrar();
        }
    }
    function colisao(element){
        rect1 = dino.element.getBoundingClientRect();
        rect2 = element.getBoundingClientRect();
        var overlap=false;
        if(dino.status==1){
            cond1 = rect1.right < (rect2.left+10);
            cond2 = rect1.left > rect2.right;
            cond3 = rect1.bottom < (rect2.top);
            cond4 = rect1.top > rect2.bottom;
            overlap = ! (cond1 || cond2 || cond3 || cond4 );   
            //console.log('status1 -',cond1,cond2,cond3,cond4)
        }
        
        if(overlap==true){
            gameStatus=typeStatus[3];
            dino.status=5;
            if(n_pont > high_score){
                high_score=n_pont;
            }
            gameOver.mostrar();
        }
    }

    function Passaros(){
        this.frames =0;
        this.status=0;
        this.alturas = ['110px','85px','55px'];
        this.element = document.createElement("div");
        this.element.className = "passaro passaro1";
        //this.element.style.top = this.alturas[Math.floor(Math.random()*3)];
        this.element.style.top = this.alturas[2];
        this.element.style.right="0px";
        
        deserto.element.appendChild(this.element);
    }
    Passaros.prototype.mover = function () {
        this.element.style.right = (parseFloat(this.element.style.right) + velocity) + "em";
        this.frames+=1;
        if(this.frames>50){
            if(this.status==0){
                this.element.className = "passaro passaro1";
                this.status=1;
                this.frames=0;
            }else{
                this.element.className="passaro passaro2"
                this.status=0;
                this.frames=0;
            }
        }

    }
    Passaros.prototype.colisao =  function () {
        dinossaur = dino.element.getBoundingClientRect();
        passaro = this.element.getBoundingClientRect();
        var cond1,cond2,cond3,cond4;
        var overlap=false;
        if(this.alturas[0] == this.element.style.top){
            cond1 = dinossaur.right < (passaro.left+20);
            cond2 = dinossaur.left+20 > (passaro.right);
            cond3 = dinossaur.bottom < (passaro.top+10);
            cond4 = dinossaur.top > (passaro.bottom);
            overlap = ! (cond1 || cond2 || cond3 || cond4 );   
            
            //overlap=!cond1; 
           // console.log('status3 -',cond1,cond2,cond3,cond4);
        }
        if(this.alturas[1] == this.element.style.top){
            cond1 = dinossaur.right < (passaro.left+20);
            cond2 = dinossaur.left+17 > (passaro.right);
            cond3 = dinossaur.bottom < (passaro.top+10);
            cond4 = dinossaur.top > (passaro.bottom);
            overlap = ! (cond1 || cond2 || cond3 || cond4 );   
            
            //overlap=!cond1; 
           // console.log('status3 -',cond1,cond2,cond3,cond4);
        }if(this.alturas[2] == this.element.style.top){
            cond1 = dinossaur.right < (passaro.left+20);
            cond2 = dinossaur.left+17 > (passaro.right);
            cond3 = dinossaur.bottom < (passaro.top+10);
            cond4 = dinossaur.top > (passaro.bottom-15);
            overlap = ! (cond1 || cond2 || cond3 || cond4 );   
            
            //overlap=!cond1; 
            //console.log('status3 -',cond1,cond2,cond3,cond4);
        }
        


        if(overlap==true){
           // console.log(dinossaur.left+15,passaro.right);
            gameStatus=typeStatus[3];
            dino.status=5;
            if(n_pont > high_score){
                high_score=n_pont;
            }
            gameOver.mostrar();
        }
    }

    function GameOver(){
        this.element = document.createElement("div");
        this.element.className = "gameoverText";
        this.btn = document.createElement("div");
        this.btn.className = "btnRestart";
        
    }
    GameOver.prototype.mostrar =function(){
        deserto.element.appendChild(this.btn);
        deserto.element.appendChild(this.element);
    }
    GameOver.prototype.retirar = function(){
        deserto.element.removeChild(this.btn);
        deserto.element.removeChild(this.element);
    }


    function run () {
        
        /* ------------------------ NUVEM ----------------------------*/
        gerarNuvens();
       
        p = Math.random();
        framesObs+=1;
       // console.log(p);
        // 80% de gerar cactos
        if(p<0.8){
            gerarCactos();
        }else{
            gerarPassaros();
        }

        moverObstaculos();

        /* --------------------------------------------------------------------------------------------- */
        aumentaVelocidade();

        incrementaPontos();

        //Em caso de game over
        //clearInterval(gameLoop);
        if(gameStatus==typeStatus[3]){
            clearInterval(gameLoop);
            clearInterval(backLoop);
        }

        dino.correr();
        deserto.mover();
    }
    function aumentaVelocidade(){
        if(qtd_frames_velocity==1000){
            qtd_frames_velocity=0;
            velocity=(velocity+0.005)
        }else{
            qtd_frames_velocity+=1
        }
    }

    function incrementaPontos(){
        
        if(qtd_frames_pontos<30){
            qtd_frames_pontos+=1
        }else{
            qtd_frames_pontos=0
            n_pont+=1;
            output = []
            s_pont = n_pont.toString();

            for (var i = 0, len = s_pont.length; i < len; i += 1) {
                output.unshift(+s_pont.charAt(i));
            }
            pont.setNumber(pont.a,output[0])
            if(output[1]!=undefined){
                pont.setNumber(pont.b, output[1])
            }
            if(output[2]!=undefined){
                pont.setNumber(pont.c, output[2])
            }
            if(output[3]!=undefined){
                pont.setNumber(pont.d, output[3])
            }
            if(output[4]!=undefined){
                pont.setNumber(pont.e, output[4])
            }
            if(!n_pont%100){
                PROB_CACTO+=5;
                PROB_PASSARO+=5;
            }
                
        }

        
    }

    function gerarNuvens(){
        if (Math.floor(Math.random()*1000) <= PROB_NUVEM) {
            nuvens.push(new Nuvem());
            if(nuvens.length>10){
                v = nuvens.shift();
                
                deserto.element.removeChild(v.element);
                v=null;
            }
        }
        nuvens.forEach(function (n) {
            n.mover();
        });
    }

    function gerarCactos(){
        if (Math.floor(Math.random()*1000)<= PROB_CACTO && framesObs > 250){
            framesObs=0;
            var ind = Math.floor(Math.random()*6)
            
            cactos.push(new Cactos(typeCactos[ind]));
            if(cactos.length>10){
                c = cactos.shift();
                deserto.element.removeChild(c.cacto);
                c=null;
            }
        }
        
    }
    function gerarPassaros(){
        if (Math.floor(Math.random()*1000)<= PROB_PASSARO && framesObs > 200){
            framesObs=0;
            passaros.push(new Passaros());
            if(passaros.length>5){
                p = passaros.shift();
                deserto.element.removeChild(p.element);
            }
        }
        
    }
    function moverObstaculos(){
        cactos.forEach(function(c){
            c.mover();
            c.colisao();
        });

        passaros.forEach(function(p){
            p.mover();
            p.colisao();
        });
    }
   
    init(); 
    
    gameOver.btn.addEventListener("click",function(e){
        document.body.innerHTML="";
        n_pont=0;
        nuvens=[];
        cactos=[];
        passaros=[];
        restart();
        
    });
    function restart () {
        deserto = new Deserto();
        dino = new Dino();
        gameStatus = typeStatus[1];

        pont = new Pontuacao(high_score);
        velocity=0.06
        gameStatus=typeStatus[1];
        dino.status=1;
        gameLoop = setInterval(run, 1000/FPS);
        backLoop = setInterval(Background,60000)
        
        
        document.body.style.backgroundColor="white";
        //pont.setSprite(pont.sprites[0]);
    }

})();master@icomp-pc ~/Área de Trabalho/progweb/tRex/js $ 
