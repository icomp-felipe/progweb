(function () {

    // Variáveis de controle de velocidade dos objetos dinâmicos do jogo
    const FPS = 300;
    const PROB_NUVEM = 3;

    // Variáveis de controle dos loops do jogo
    var game_loop;
    var turno_loop;

    // Variáveis dos objetos visuais do jogo
    var div_deserto;
    var div_dino;
    var div_pontuacao_cur;
    var div_pontuacao_max;
    var div_nuvens_array = [];

    // Controle de execução do jogo
    var game_started = false;
    var game_running = false;

    // Variável de controle do dia e noite
    var dia = true;
    

    var game_frames = 0;
    var chao_width = window.innerWidth;
    var turno_segundos = 0;


    /** Inverte uma String */
    String.prototype.reverse = function() {
        return this.split("").reverse().join("");
    }

    /** Tratamento de eventos de teclado para 'Seta p/ Cima' */
    addEventListener("keydown", function (event) {

        //console.log(event);
        // Quando uma seta para cima é pressionada...
        if (event.keyCode == 38) {

            // ...e o jogo ainda não foi iniciado, dou o start e...
            if (!game_started) {
                start_pause();
                game_started = true;
            }

            // ...faço o dinossauro pular
            if (div_dino.status == 0)
                div_dino.status  = 1;
            
        }

        // Quando uma seta pra baixo é pressionada, o dinossauro agacha
        else if (event.keyCode == 40) {
            div_dino.status = 3;
        }

        // Quando a tecla 'p' é pressionada, pauso ou continuo o jogo
        else if (event.keyCode == 80) {
            start_pause();
        }

        // teste de troca de turno
        else if (event.key == "t") {
            troca_turno();
        }

    });

    addEventListener("keyup", function (event) {

        if (event.keyCode == 40)
            div_dino.status = 0;

    });

    /****************************************************************************/
    /*                             Classe Deserto                               */
    /****************************************************************************/

    /** Contém a modelagem estática do deserto */
    class Deserto {

        constructor() {

            // Aqui crio uma 'div' que vai conter todos os elementos do deserto
            this.element = document.createElement("div");
            this.element.className = "deserto";

            document.body.appendChild(this.element);

            // Aqui crio outra 'div' que representa o chão do deserto
            this.chao = document.createElement("div");
            this.chao.className = "chao reversible";
            this.chao.style.width = chao_width + "px";
            this.chao.style.backgroundPositionX = "0px";

            // Note que 'chao' é um elemento do 'deserto'
            this.element.appendChild(this.chao);
        }

        /** Move o chão do deserto de '1px' para a esquerda */
        mover() {
            this.chao.style.backgroundPositionX = Deserto.calcula_posicao(this.chao);
        }

        /** Calcula a posição horizontal do chão */
        static calcula_posicao(chao) {

            // Lendo a propriedade 'background-position-x' do CSS do 'chao'
            var posicao = parseInt(chao.style.backgroundPositionX);

            // Reinicio a posição para '2px' do sprint do chão quando o seu final é atingido
            if (posicao <= -1200)
                posicao = -2;

            // Retornando a nova posição (deslocada '1px' pra esquerda)
            return (posicao - 1) + "px";
        }

    }

    /****************************************************************************/
    /*                               Classe Dino                                */
    /****************************************************************************/

    /** Contém a modelagem e comportamento do T-Rex */
    class Dino {

        constructor() {

            this.sprites = {
                'correr1':'-765px',
                'correr2':'-809px',
                'pulando':'-677px',
                'agachado1': '-940px',
                'agachado2': "-1000px"
            };

            this.frames = 0;

            this.status = 0; // 0:correndo; 1:subindo; 2: descendo; 3: agachado
            this.alturaMaxima = "80px";

            this.element = document.createElement("div");
            this.element.className = "dino";
            this.element.style.backgroundPositionX = this.sprites.pulando;
            this.element.style.bottom = "0px";

            div_deserto.element.appendChild(this.element);

        }

        correr() {

            if (this.status == 0) {

                if (this.frames == 30) {
                    this.element.style.backgroundPositionX = (this.element.style.backgroundPositionX == this.sprites.correr1)?this.sprites.correr2:this.sprites.correr1;
                    this.frames = 0;
                }
                else
                    this.frames++;
            }
            else if (this.status == 1) {
                this.element.style.backgroundPositionX = this.sprites.pulando;
                this.element.style.bottom = (parseInt(this.element.style.bottom) + 1) + "px";
                if (this.element.style.bottom == this.alturaMaxima) this.status = 2;
            }
            else if (this.status == 2) {
                this.element.style.bottom = (parseInt(this.element.style.bottom) - 1) + "px";
                if (this.element.style.bottom == "0px") this.status = 0;
            }
            else if (this.status == 3) {

                if (this.frames == 30) {
                    this.element.style.backgroundPositionX = (this.element.style.backgroundPositionX == this.sprites.agachado1)?this.sprites.agachado2:this.sprites.agachado1;
                    this.frames = 0;
                }
                else
                    this.frames++;
            }

        }
        
    }

    /****************************************************************************/
    /*                             Classe Pontuacao                             */
    /****************************************************************************/

    class Pontuacao {

        constructor(className) {

            // Inicializando a pontuação
            this.pontuacao = 0;

            // Inicializando o vetor de dígitos (sprites)
            this.digitos = [];

            // Aqui crio um 'div' que irá encapsular os 5 dígitos da pontuação
            this.element = document.createElement("div");

            // Dou uma flexibilidade ao nome de classe para diferenciar a pontuação corrente da máxima
            this.element.className = className;
    
            // Aqui instancio mais 5 'div', uma para cada dígito da pontuação
            for (var i=0; i<5; i++) {

                this.digitos[i] = document.createElement("div");
                this.digitos[i].className = "digito_pontuacao reversible";

                // Inicializo todos com o dígito '0', localizado aos '484px' dos sprites
                this.digitos[i].style.backgroundPositionX = "-484px";

                // Cada dígito é espaçado de '10px' uns dos outros
                this.digitos[i].style.right = (i*10+10) + "px";

                // Adicionando cada 'div filha' à sua mãe
                this.element.appendChild(this.digitos[i]);
            }
    
            // Adidionando a 'div mãe' à view
            document.body.appendChild(this.element);

        }

        /** Incrementa a pontuação e atualiza a view */
        increase() {

            this.pontuacao++;
            Pontuacao.displayPoints(this.pontuacao,this.digitos);

        }

        /** Atualiza a pontuação da view */
        static displayPoints(pontos,digitos) {

            // Aqui crio uma string com exatamente 5 dígitos a partir da numeração.
            // Ela é invertida para 'casar' com as 'div' da view no processamento do loop.
            // OBS.: String.padStart() é uma função do ECMAScript 8!
            var aux = pontos.toString().padStart(5,'0').reverse();

            for (var i=0; i<5; i++)
                digitos[i].style.backgroundPositionX = "-" + (parseInt(aux[i]) * 10 + 484) + "px";
            
        }

        /** Se este objeto representar uma pontuação máxima, será exibido o sprite 'HI' */
        isMax() {

            this.max = document.createElement("div");
            this.max.className = "digito_pontuacao_max reversible";
            this.element.appendChild(this.max);
        
        }

        /** Retorna a pontuação */
        getPontuacao() {
            return this.pontuacao;
        }

        /** Seta a pontuação e a exibe */
        setPontuacao(pontuacao) {
            this.pontuacao = pontuacao;
            Pontuacao.displayPoints(this.pontuacao,this.digitos);
        }

    }

    /****************************************************************************/
    /*                               Classe Nuvem                               */
    /****************************************************************************/  

    /** Representa cada nuvem do deserto */
    class Nuvem {

        constructor() {

            // Aqui crio uma 'div' que representará uma nuvem
            this.element = document.createElement("div");
            this.element.className = "nuvem";

            // A nuvem é criada sempre mais a direita e com distância em relação ao topo entre 0 e 120px
            this.element.style.right = "0px";
            this.element.style.top = Math.floor(Math.random() * 120) + "px";

            // Note que a nuvem é filha do deserto!
            div_deserto.element.appendChild(this.element);
        }

        // Move a nuvem '1px' pra esquerda
        mover() {
            this.element.style.right = (parseInt(this.element.style.right) + 1) + "px";
        }

    }

    /****************************************************************************/
    /*                             Bloco de Funções                             */
    /****************************************************************************/ 

    /** Pausa ou continua a execução do jogo, dependendo de seu estado atual */
    function start_pause() {

        // Caso o jogo esteja rodando, o pauso...
        if (game_running) {
            clearInterval(game_loop);
            game_running = false;
        }

        // ...caso contrário, continuo sua execução
        else {
            game_loop = setInterval(run, 1000/FPS);
            game_running = true;
        }

    }

    /** Controla a troca de turno do jogo */
    function controla_turno() {

        // Se o jogo está rodando (foi iniciado e não está pausado)...
        if (game_running) {

            // ...e se já se passaram 60 segundos, troco o turno e zero meu contador de segundos
            if (turno_segundos == 60) {

                troca_turno();
                turno_segundos = 0;
    
            }

            // ...senão, apenas incremento o contador de segundos
            else
                turno_segundos++;

        }

    }

    /** Muda as cores dos elementos visuais do jogo, dependendo do turno */
    function troca_turno() {

        if (dia) {

            // Escurecendo o deserto
            div_deserto.element.style.backgroundColor = "black";
    
            // Revertendo as cores dos elementos visuais com cor reversível (classe 'reversible')
            // Aqui o que era escuro, ficou claro.
            document.querySelectorAll(".reversible").forEach(function(elemento) {
                elemento.style.filter = "brightness(0) invert(1)";
            });
    
            // Trocando o turno
            dia = false;
    
        }
        else {

            // Clareando o deserto
            div_deserto.element.style.backgroundColor = "white";
    
            // Revertendo as cores dos elementos visuais com cor reversível (classe 'reversible').
            // Aqui, o que era claro, ficou escuro.
            document.querySelectorAll(".reversible").forEach(function(elemento) {
                elemento.style.filter = "brightness(100) invert(1)";
            });
    
            // Trocando o turno
            dia = true;
    
        }
    
    }

    /** Função responsável pelo controle da pontuação corrente */
    function controla_pontuacao() {

        // A cada 30 frames incremento a pontuação
        if (game_frames % 30 == 0)
            div_pontuacao_cur.increase();

    }

    /** Função responsável pelo controle de dificuldade do jogo */
    function controla_dificuldade() {

        // A cada 1000 frames a velocidade do...
        if (game_frames % 1000 == 0) {

        }

    }

    /** Função responsável pelo controle de exibição das nuvens */
    function controla_nuvens() {

        // Cria uma nova nuvem e a adiciona no array de nuvens;
        // A probabilidade de criação de novas nuvens é de: (PROB_NUVEM)%
        if (Math.floor(Math.random() * 1000) <= PROB_NUVEM)
            div_nuvens_array.push(new Nuvem());
        
        // Loop que remove da view as nuvens que já ultrapassaram a área de exibição
        for (var i = (div_nuvens_array.length - 1); i>=0; --i) {

            if (parseInt(div_nuvens_array[i].element.style.right) > chao_width) {
                div_deserto.element.removeChild(div_nuvens_array[i].element);
                div_nuvens_array.splice(i,1);
            }

        }
        
        // Loop que movimenta cada nuvem do array com a metade da velocidade do dino
        if (game_frames % 2 == 0) {
            div_nuvens_array.forEach(function (nuvem) {
                nuvem.mover();
            });
        }

    }

    /** Inicializa o jogo */
    function init () {

        // Cria o deserto com chão e o dinossauro
        div_deserto = new Deserto();
        div_dino    = new Dino();

        // Cria as pontuações
        div_pontuacao_cur = new Pontuacao("pontuacao_corrente");
        div_pontuacao_max = new Pontuacao("pontuacao_maxima");
        div_pontuacao_max.isMax();

        // Inicia o controlador de mudança de turno
        turno_loop = setInterval(controla_turno,1000);

    }

    /** Loop principal de execução do jogo */
    function run () {

        div_dino   .correr();
        div_deserto.mover ();

        controla_nuvens();

        controla_pontuacao();
        controla_dificuldade();

        game_frames++;

    }

    // Inicia o jogo
    init();

})();