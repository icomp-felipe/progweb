/************************************************
*       Comportamento do Jogo do T-Rex          *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 25/05/2019                           *
*************************************************/

(function () {

    // Variáveis de controle de velocidade dos objetos dinâmicos do jogo
    const PROB_NUVEM   = 3;
    var pixels_to_move = 0.5;

    // Velocidade máxima de movimentação é de 3 pixels a cada ms
    var velocidade_max = 3.0;

    // Armazena as dificuldades possíveis do jogo
    // [0]: easy  [1]: normal  [2]: medium  [3]: hard  [4]: insane
    var dificuldade = [
        { 'obstacle_probability':  15, 'max_score':  200 },  //10k frames
        { 'obstacle_probability':  30, 'max_score':  600 },
        { 'obstacle_probability':  50, 'max_score': 1500 },
        { 'obstacle_probability':  80, 'max_score': 3500 },
        { 'obstacle_probability': 100, 'max_score': Infinity }
    ];

    // Armazena a dificuldade atual do jogo
    var dificuldade_atual = dificuldade[0];

    /** Função responsável pelo controle de dificuldade do jogo */
    function controla_dificuldade() {

        // Se a pontuação máxima para a dificuldade atual já foi atingida...
        if (div_pontuacao_cur.getPontuacao() > dificuldade_atual.max_score) {
    
            // ...aumento a dificuldade
            var cur_index = dificuldade.findIndex(node => node.max_score === dificuldade_atual.max_score);
            dificuldade_atual = dificuldade[cur_index + 1];
    
        }

        // Aumenta a velocidade do Dino de 0.5px a cada 1000 frames passados
        if ((game_frames_veloc >= 1000) && (pixels_to_move <= velocidade_max)) {
            pixels_to_move += 0.05;
            game_frames_veloc = 0.0;
        }
    
    }

    // Variáveis de controle dos loops do jogo
    var game_loop;
    var turno_loop;

    // Variáveis dos objetos visuais do jogo
    var div_deserto;
    var div_dino;
    var div_game_over;
    var div_pontuacao_cur;
    var div_pontuacao_max;
    var div_nuvens_array = [];
    var div_pterossauros_array = [];
    var div_cactos_array = [];

    // Controle de execução do jogo
    var game_started = false;
    var game_running = false;

    // Variável de controle do dia e noite
    var dia = true;

    // Armazena o tamanho do chão, calculado ao iniciar a aplicação
    var chao_width;

    // Contadores de frames e de tempo de turno (dia/noite)
    var game_frames       = 0;
    var game_frames_pont  = 0.0;
    var game_frames_veloc = 0.0;
    var turno_segundos    = 0;
    
    // Contém os áudios do jogo
    var audio_template = document.getElementById("audios");
    var audio_files    = audio_template.content.cloneNode(true);

    var audios = {
        'tecla'    : new Audio(audio_files.getElementById("audio-tecla"    ).src),
        'pontuacao': new Audio(audio_files.getElementById("audio-pontuacao").src),
        'colidiu'  : new Audio(audio_files.getElementById("audio-colisao"  ).src)
    };

    /** Inverte uma String */
    String.prototype.reverse = function() {
        return this.split("").reverse().join("");
    }

    /****************************************************************************/
    /*                         Bloco de EventListeners                          */
    /****************************************************************************/

    document.querySelector("#iniciar").addEventListener("click", function() {
        event_start_game();
    });

    /** Tratamento de eventos de pressionamento de teclas */
    addEventListener("keydown", function (event) {

        // Quando uma seta para cima ou barra de espaço é pressionada...
        if (event.keyCode == 38 || event.keyCode == 32)
            event_start_jump();

        // Quando uma seta pra baixo é pressionada e o dinossauro está correndo, ele agacha
        else if (event.keyCode == 40)
            event_dino_squat();

        // Quando a tecla 'p' é pressionada, pauso ou continuo o jogo
        else if (event.keyCode == 80)
            start_pause();

    });

    /** Tratamento de eventos de liberação/soltura de teclas */
    addEventListener("keyup", function (event) {

        // Se o botão soltado for uma seta pra baixo e o Dino estiver
        // correndo agachado, faço o Dino correr em pé de novo
        if (event.keyCode == 40)
            event_dino_raise();

    });

    var x_down = null;
    var y_down = null;

    /** Tratamento de eventos de touchscreen e trackpad.
     *  Captura a posição do primeiro evento de touch.   */
    document.addEventListener("touchstart", function(event) {

        event.preventDefault ();
        event.stopPropagation();

        x_down = event.touches[0].clientX;
        y_down = event.touches[0].clientY;

    });

    /** Tratamento de eventos de touchscreen e trackpad.
     *  Captura eventos de deslize para cima e para baixo. */
    document.addEventListener("touchmove", function(event) {

        // Se não ocorreu nenhum evento, pego minha bike e vou embora!
        if (!x_down || !y_down)
            return;
        
        // Capturando a nova posição do touch
        var x_up = event.touches[0].clientX;
        var y_up = event.touches[0].clientY;

        // Calculando o espaço percorrido
        var x_diff = (x_down - x_up);
        var y_diff = (y_down - y_up);

        // Se realizei algum deslocamento vertical...
        if (Math.abs(x_diff) <= Math.abs(y_diff)) {

            // ...para cima, inicio o jogo e faço o Dino pular ou levantar (caso esteja agachado)
            if (y_diff > 0) {
                event_start_jump();
                event_dino_raise();
            }

            // ...para baixo, faço o Dino agachar
            else
                event_dino_squat();
            
            // Resetando as variáveis de posição
            x_down = null;
            y_down = null;

        }

    });

    function event_start_game() {

        // ...e o jogo ainda não foi iniciado, dou o start e...
        if (!game_started) {

            div_dino.estado_atual = "pulando_subindo"
            start_pause();
            game_started = true;
        
        }

    }

    /** Função executada quando o jogo inicia ou quando o Dino deve pular */
    function event_start_jump() {

        // ...faço o dinossauro pular
        if (div_dino.estado_atual == "correndo_normal") {

            div_dino.estado_atual  = "pulando_subindo";
            play_audio(audios.tecla);

        }

    }

    /** Função executada quando o jogo inicia ou quando o Dino deve agachar */
    function event_dino_squat() {

        if (div_dino.estado_atual == "correndo_normal")
            div_dino.estado_atual = "correndo_agachado";

    }

    /** Função executada quando o jogo inicia ou quando o Dino deve levantar */
    function event_dino_raise() {

        if (div_dino.estado_atual == "correndo_agachado")
            div_dino.estado_atual = "correndo_normal";

    }

    /****************************************************************************/
    /*                               Classe Cacto                               */
    /****************************************************************************/

    /** Representa os Cactos do deserto */
    class Cacto {

        constructor() {

            // Localização das imagens do Cacto nos sprites
            this.sprites = [
                {'position': '-227px', 'width': '18px', 'height': '40px'},   // 1 pequeno
                {'position': '-245px', 'width': '34px', 'height': '40px'},   // 2 pequenos
                {'position': '-279px', 'width': '52px', 'height': '40px'},   // 3 pequenos
                {'position': '-331px', 'width': '26px', 'height': '53px'},   // 1 grande
                {'position': '-357px', 'width': '50px', 'height': '53px'},   // 2 grandes
                {'position': '-407px', 'width': '75px', 'height': '53px'}    // 4 misto
            ];

            // Construção do Cacto
            this.element = document.createElement("div");
            this.element.className    = "cacto";
            this.element.style.right  = "0px";

            // Constrói um cacto aleatório com base nos sprites
            this.setRandomSprite();

            // Adicionando o Cacto ao deserto
            div_deserto.element.appendChild(this.element);

        }

        // Move o Cacto '1px' pra esquerda
        mover() {

            // Desloca o Pterossauro '1px' pra esquerda
            this.element.style.right = (parseFloat(this.element.style.right) + pixels_to_move) + "px";

        }

        // Gera um Cacto aleatório com base nos sprites
        setRandomSprite() {

            var index  = Math.floor(Math.random() * this.sprites.length);
            var sprite = this.sprites[index];

            this.element.style.width  = sprite.width ;
            this.element.style.height = sprite.height;
            this.element.style.backgroundPositionX = sprite.position;

        }

        // Remove todos os Cactos do deserto
        static clearAll() {

            for (var i = div_cactos_array.length - 1; i >=0; --i) {
                div_deserto.element.removeChild(div_cactos_array[i].element);
                div_cactos_array.splice(i,1);
            }

        }

    }

    /****************************************************************************/
    /*                             Classe Deserto                               */
    /****************************************************************************/

    /** Contém a modelagem estática do deserto */
    class Deserto {

        constructor() {

            // Aqui crio uma 'div' que vai conter todos os elementos do deserto
            this.element = document.createElement("div");
            this.element.className = "deserto";

            var x = document.querySelector("#jogo");
            x.appendChild(this.element);

            // Aqui crio outra 'div' que representa o chão do deserto
            this.chao = document.createElement("div");
            this.chao.className = "chao reversible";
            this.chao.style.backgroundPositionX = "0px";

            // Note que 'chao' é um elemento do 'deserto'
            this.element.appendChild(this.chao);

            // Aqui seto a variavel que indica a largura do chao
            chao_width = this.chao.clientWidth;
            
        }

        /** Move o chão do deserto de '1px' para a esquerda */
        mover() {
            this.chao.style.backgroundPositionX = Deserto.calcula_posicao(this.chao);
        }

        /** Remove todos os inimigos e nuvens do deserto */
        static reset() {

            Cacto.clearAll();
            Nuvem.clearAll();
            Pterossauro.clearAll();

        }

        /** Calcula a posição horizontal do chão */
        static calcula_posicao(chao) {

            // Lendo a propriedade 'background-position-x' do CSS do 'chao'
            var posicao = parseFloat(chao.style.backgroundPositionX);

            // Retornando a nova posição (deslocada 'pixels_to_move'px pra esquerda)
            return (posicao - pixels_to_move) + "px";
        }

    }

    /****************************************************************************/
    /*                               Classe Dino                                */
    /****************************************************************************/

    /** Contém a modelagem e comportamento do T-Rex */
    class Dino {

        constructor() {

            // Localização das imagens do dino nos sprites
            this.sprites = {
                'correr_esq'    : {'positionX': '-765px' , 'positionY': '-3px' , 'width': '44px', 'height': '45px'},
                'correr_dir'    : {'positionX': '-809px' , 'positionY': '-3px' , 'width': '44px', 'height': '45px'},
                'agachado_esq'  : {'positionX': '-941px' , 'positionY': '-20px', 'width': '58px', 'height': '30px'},
                'agachado_dir'  : {'positionX': '-1000px', 'positionY': '-20px', 'width': '58px', 'height': '30px'},
                'parado_pulando': {'positionX': '-677px' , 'positionY': '-3px' , 'width': '44px', 'height': '45px'},
                'colidido'      : {'positionX': '-854px' , 'positionY': '-3px' , 'width': '44px', 'height': '45px'}
            };

            // Define o estado atual do Dino
            this.estado_atual = "parado";

            // Define a altura máxima do pulo do Dino
            this.alturaMaxima = 86;
            this.pode_descer  = 0;

            // Construção do Dino
            this.element = document.createElement("div");
            this.element.className = "dino";
            this.element.style.bottom = "0px";
            this.element.style.height = "45px";
            this.setSprite(this.sprites.parado_pulando);

            // Adicionano o Dino ao deserto
            div_deserto.element.appendChild(this.element);

        }

        /** Define a posição do sprite, largura e altura */
        setSprite(sprite) {
            this.element.style.backgroundPositionX = sprite.positionX;
            this.element.style.backgroundPositionY = sprite.positionY;
            this.element.style.height = sprite.height;
            this.element.style.width = sprite.width;
        }

        /** Mata o Dino */
        mata() {
            this.estado_atual = "colidido";
            this.setSprite(this.sprites.colidido);
        }

        /** Ressuscita o Dino */
        ressuscita() {
            this.estado_atual = "parado";
            this.element.style.bottom = "0px";
            this.setSprite(this.sprites.parado_pulando);
        }

        /** Implementação da Máquina de Estados dos movimentos do Dino */
        movimentar() {

            var style = this.element.style;

            switch(this.estado_atual) {

                // Define o Dino parado
                case "parado":
                    this.setSprite(this.sprites.parado_pulando);
                break;

                // Define o Dino correndo em pé. Mudo de sprite a cada 30 frames, pra esta mudança poder ser perceptível
                case "correndo_normal":
                    if (game_frames % 30 == 0)
                        this.setSprite((style.backgroundPositionX == this.sprites.correr_esq.positionX) ? this.sprites.correr_dir :this.sprites.correr_esq);
                break;

                // Define o Dino subindo ao pular
                case "pulando_subindo":

                    // Definindo o sprite
                    this.setSprite(this.sprites.parado_pulando);

                    // Recuperando a 'altura atual' do Dino em relação ao chão
                    var bottom = style.bottom;

                    // Se já atingi a altura máxima do pulo, espero um pouquinho lá em cima e começo a descer...
                    if (parseFloat(bottom) >= this.alturaMaxima)

                        if (this.pode_descer == 6) {
                            this.estado_atual = "pulando_descendo";
                            this.pode_descer  = 0;
                        }

                        else
                            this.pode_descer++;

                    // ...senão, continuo subindo
                    else
                        style.bottom = (parseFloat(bottom) + pixels_to_move) + "px";

                break;

                // Define o Dino descendo ao pular
                case "pulando_descendo":

                    // Definindo o sprite
                    this.setSprite(this.sprites.parado_pulando);

                    // Recuperando a 'altura atual' do Dino em relação ao chão
                    var bottom = style.bottom;

                    // Se já atingi o chão, começo novamente a correr...
                    if (parseFloat(bottom) <= 0)
                        this.estado_atual = "correndo_normal";
                    
                    // ...senão, continuo descendo
                    else
                        style.bottom = (parseFloat(bottom) - pixels_to_move) + "px";
                break;

                // Define o Dino correndo agachado. Mudo de sprite a cada 30 frames, pra esta mudança poder ser perceptível
                case "correndo_agachado":
                    if (game_frames % 30 == 0)
                        this.setSprite((style.backgroundPositionX == this.sprites.agachado_esq.positionX) ? this.sprites.agachado_dir : this.sprites.agachado_esq);
                break;

                // Define o Dino colidido
                case "colidido":
                    this.setSprite(this.sprites.colidido);
                break;

            }

        }
        
    }

    /****************************************************************************/
    /*                             Classe GameOver                              */
    /****************************************************************************/

    /** Contém a mensagem de Game Over e o botão de restart */
    class GameOver {

        constructor() {

            // Aqui crio uma 'div' que encapsula a mensagem e o botão
            this.element = document.createElement("div");
            this.element.className = "game_over_div";

            // Esta div contém apenas a mensagem "Game Over"
            this.game_over = document.createElement("div");
            this.game_over.className  = "game_over";
            this.element.appendChild(this.game_over);

            // Esta outra div contém o botão de restart
            this.botao_restart = document.createElement("div");
            this.botao_restart.className = "botao_restart";
            this.botao_restart.onclick   = reinicia;
            this.element.appendChild(this.botao_restart);

        }

        /** Controla a visibilidade desta div */
        setVisible(visibility) {

            if (visibility)
                div_deserto.element.appendChild(this.element);
            else
                div_deserto.element.removeChild(this.element);

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

        // Move a nuvem pra esquerda sempre com a metade da velocidade do Dino
        mover() {
            this.element.style.right = (parseFloat(this.element.style.right) + (pixels_to_move / 2)) + "px";
        }

        /** Remove todas as nuvens do deserto */
        static clearAll() {
            
            for (var i = div_nuvens_array.length - 1; i >=0; --i) {
                div_deserto.element.removeChild(div_nuvens_array[i].element);
                div_nuvens_array.splice(i,1);
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
            this.element.className = `pontuacao ${className}`;
    
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
            div_deserto.element.appendChild(this.element);

        }

        /** Incrementa a pontuação e atualiza a view */
        increase() {

            this.pontuacao++;

            // Atualiza a pontuação da tela quando este componente não está 'piscando'
            if (blink_times == 0)
                Pontuacao.displayPoints(this.pontuacao,this.digitos);

            // Reproduz o som de pontuação a cada 100 pontos adquiridos e faz a 'div' de pontuação piscar 4x
            if (this.pontuacao % 100 == 0) {

                play_audio(audios.pontuacao);
                blink_pontuacao();
                blink_interval = setInterval(blink_pontuacao,350);

            }

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

        /** Reinicia a pontuação e atualiza a view */
        reset() {

            this.pontuacao = 0;
            Pontuacao.displayPoints(this.pontuacao,this.digitos);

        }

        /** Atualiza a pontuação máxima (se ela for máxima mesmo) */
        pontuacao_max(pontuacao) {

            if (pontuacao >= this.pontuacao)
                this.pontuacao = pontuacao;

            Pontuacao.displayPoints(this.pontuacao,this.digitos);
        }

    }

    var blink_times = 0;
    var blink_interval = null;

    /** Controla o piscar da 'div' de pontuação atual */
    function blink_pontuacao() {

        var style = document.querySelector(".corrente").style;

        // Piscando a 'div'
        if (style.visibility == "visible")
            style.visibility = "hidden";
        else
            style.visibility = "visible";
        
        // Controlando o tempo máximo de piscadas
        if (blink_times == 8) {

            style.visibility = "visible";
            blink_times      = 0;

            clearInterval(blink_interval);
            blink_interval = null;

        }
        else
            blink_times++;

    }

    /****************************************************************************/
    /*                            Classe Pterossauro                            */
    /****************************************************************************/
    
    /** Representa os Pterossauros do deserto */
    class Pterossauro {

        constructor() {

            // Localização das imagens do Pterossauro nos sprites
            this.sprites = {
                'ptero_esq': '-134px',
                'ptero_dir': '-180px'
            };

            // Construção do Pterossauro
            this.element = document.createElement("div");
            this.element.className = "pterossauro";
            this.element.style.right  = "0px";
            this.element.style.bottom = Pterossauro.getRandomHeight();
            this.element.style.backgroundPositionX = this.sprites.ptero_esq;

            // Adicionando o Pterossauro ao deserto
            div_deserto.element.appendChild(this.element);

        }

        // Move o Pterossauro 'pixels_to_move'px pra esquerda
        mover() {

            var style = this.element.style;

            // Faz o Pterossauro bater as asas a cada 50 frames
            if (game_frames % 50 == 0)
                style.backgroundPositionX = (style.backgroundPositionX == this.sprites.ptero_esq) ? this.sprites.ptero_dir : this.sprites.ptero_esq;

            // Desloca o Pterossauro '1px' pra esquerda
            style.right = (parseFloat(style.right) + pixels_to_move) + "px";

        }

        // Retorna uma altura aleatória para o aparecimento do Pterossauro
        static getRandomHeight() {

            var alturas = ["5px","35px","50px"];

            return alturas[Math.floor(Math.random() * 3)];

        }

        // Remove todos os Pterossauros do deserto
        static clearAll() {

            for (var i = div_pterossauros_array.length - 1; i >=0; --i) {
                div_deserto.element.removeChild(div_pterossauros_array[i].element);
                div_pterossauros_array.splice(i,1);
            }

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
            game_loop = setInterval(run,1);
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
        if (game_frames_pont >= 30.0) {
            div_pontuacao_cur.increase();
            game_frames_pont = 0.0;
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
        
        // Loop que movimenta cada nuvem do array com a metade da velocidade do Dino
        div_nuvens_array.forEach(function (nuvem) {
            nuvem.mover();
        });

    }

    /** Função responsável pelo controle de exibição dos Pterossauros */
    function movimenta_pterossauros() {

        // Loop que remove da view os Pterossauros que já ultrapassaram a área de exibição
        for (var i = (div_pterossauros_array.length - 1); i>=0; --i) {

            if (parseInt(div_pterossauros_array[i].element.style.right) > chao_width) {
                div_deserto.element.removeChild(div_pterossauros_array[i].element);
                div_pterossauros_array.splice(i,1);
            }

        }

        // Loop que movimenta cada Pterossauro do array
        div_pterossauros_array.forEach(function (pterossauro) {
            pterossauro.mover();
        });

    }

    /** Função responsável pelo controle de exibição dos Cactos */
    function movimenta_cactos() {

        // Loop que remove da view os Cactos que já ultrapassaram a área de exibição
        for (var i = (div_cactos_array.length - 1); i>=0; --i) {

            if (parseInt(div_cactos_array[i].element.style.right) > chao_width) {
                div_deserto.element.removeChild(div_cactos_array[i].element);
                div_cactos_array.splice(i,1);
            }

        }

        // Loop que movimenta cada Pterossauro do array
        div_cactos_array.forEach(function (cacto) {
            cacto.mover();
        });

    }

    /** Já tem o nome autoexplicativo :) */
    function movimenta_obstaculos() {
        movimenta_cactos();
        movimenta_pterossauros();
    }

    /** Verifica se houve colisão entre o dino e o cacto mais à esquerda do deserto */
    function colidiu_com_cacto(dino_rect) {

        if (div_cactos_array.length == 0)
            return false;

        var cacto_rect = div_cactos_array[0].element.getBoundingClientRect();

        return (( dino_rect.right >= (cacto_rect.left + 20) ) && ( dino_rect.bottom >= (cacto_rect.top + 20) ) && ( dino_rect.left <= ( cacto_rect.right - 20) ));

    }

    /** Verifica se houve colisão entre o dino e o pterossauro mais à esquerda do deserto */
    function colidiu_com_pterossauro(dino_rect) {

        if (div_pterossauros_array.length == 0)
            return false;

        var pterossauro_rect = div_pterossauros_array[0].element.getBoundingClientRect();

        return (( dino_rect.right >= (pterossauro_rect.left + 15) ) && ( dino_rect.bottom >= (pterossauro_rect.top + 15) ) && ( dino_rect.top <= (pterossauro_rect.bottom - 10) ) && (dino_rect.left <= (pterossauro_rect.right - 10) ));

    }

    /** Verifica se o Dino colidiu com algum obstáculo do deserto */
    function controla_colisao() {

        var dino  = div_dino.element.getBoundingClientRect();

        if (colidiu_com_cacto(dino) || colidiu_com_pterossauro(dino))
            encerra_jogo();

    }

    /** Responsável por gerar obstáculos no deserto de acordo com a dificuldade atual do jogo */
    function gerador_obstaculos() {

        // A cada 300 frames (espaço mínimo definido entre aparições de obstáculos)...
        if (game_frames % 300 == 0) {

            // ...calculo a probabilidade de surgir um obstáculo no deserto e...
            if (Math.floor(Math.random() * 100) <= dificuldade_atual.obstacle_probability) {

                // ...escolho com probabilidade de 50% entre Pterossauro ou Cacto
                if (Math.random() >= 0.5)
                    div_pterossauros_array.push(new Pterossauro());
                else
                    div_cactos_array.push(new Cacto());

            }      

        }

    }

    /** Registra a pontuação do jogo no servidor */
    function cadastra_pontuacao() {

        $.ajax({
            method: "POST",
            url: "/salvar-pontuacao",
            data: {
                pontuacao: div_pontuacao_cur.getPontuacao(),
                _csrf: document.querySelector("#_csrf").value
            },
            success: function (data) {
                console.log(data);
            },
            error: function () {
                
            }
        });

    }

    /** Recupera a pontuação do jogo no servidor */
    function recupera_pontuacao() {

        $.ajax({
            method: "POST",
            url: "/recupera-pontuacao",
            data: {
                _csrf: document.querySelector("#_csrf").value
            },
            success: function (data) {
                div_pontuacao_max.pontuacao_max(data);
            },
            error: function () {
                
            }
        });

    }

    /** Executa vários procedimentos quando o jogo é encerrado */
    function encerra_jogo() {

        // Primeiro matamos o Dino
        div_dino.mata();

        // Aqui é reproduzido o áudio de colisão
        play_audio(audios.colidiu);

        // Depois os loops do jogo são encerrados
        clearInterval(game_loop);
        clearInterval(turno_loop);

        // Aqui torno visível a 'div' do Game Over
        div_game_over.setVisible(true);

        // Por fim, atualizo a pontuação máxima
        div_pontuacao_max.pontuacao_max(div_pontuacao_cur.getPontuacao());

        cadastra_pontuacao();
        
    }

    /** Prepara o jogo para uma nova rodada */
    function reinicia() {

        // Limpa todos os inimigos e nuvens do deserto
        Deserto.reset();

        // Esconde a 'div' do GameOver
        div_game_over.setVisible(false);

        // Reinicia os contadores de frames
        game_frames = 0;
        game_frames_pont = 0.0;
        game_frames_veloc = 0.0;

        // Reinicia os controladores de execução
        game_started = false;
        game_running = false;

        // Reinicia a pontuação
        div_pontuacao_cur.reset();

        // Ressuscita o Dino
        div_dino.ressuscita();

        // Reinicia a dificuldade e velocidade do jogo
        dificuldade_atual = dificuldade[0];
        pixels_to_move = 0.5;

    }

    /** Reproduz um áudio do jogo */
    function play_audio(audio) {
        audio.play();
    }

    /** Inicializa o jogo */
    function init () {

        // Cria o deserto com chão e o dinossauro
        div_deserto = new Deserto();
        div_dino    = new Dino();

        // Cria as pontuações
        div_pontuacao_cur = new Pontuacao("corrente");
        div_pontuacao_max = new Pontuacao("maxima");
        div_pontuacao_max.isMax();

        // Já prepara a div do Game Over
        div_game_over = new GameOver();

        // Inicia o controlador de mudança de turno
        turno_loop = setInterval(controla_turno,1000);

        // Delay pro browser carregar o jQuery
        setTimeout(function () {
            recupera_pontuacao();
        }, 600);

    }

    /** Loop principal de execução do jogo */
    function run () {

        div_dino   .movimentar();
        div_deserto.mover ();

        controla_nuvens();

        gerador_obstaculos();
        movimenta_obstaculos();

        controla_pontuacao();
        controla_dificuldade();

        controla_colisao();

        game_frames += 1;
        game_frames_pont += pixels_to_move;
        game_frames_veloc += pixels_to_move;

    }

    // Inicia o jogo
    init();

})();