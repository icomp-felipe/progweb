/************************************************
*             Jogo Jokenpô em JS                *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 24/04/2019                           *
*************************************************/

var input;
var pontuacao = 0;
var escolhaCPU;
var escolhas = ["Papel","Pedra","Tesoura"];

/* Retorna TRUE jogador vence a partida */
function jokenpo(jogadaUSER,jogadaCPU) {
	
	// Se o jogador escolhe Papel e a CPU, Tesoura...
	if ((jogadaUSER == 1) && (jogadaCPU == 3))
		return false;
	
	// Se o jogador escolhe Pedra e a CPU, Papel...
	if ((jogadaUSER == 2) && (jogadaCPU == 1))
		return false;
	
	// Se o jogador escolhe Tesoura e a CPU, Pedra...
	if ((jogadaUSER == 3) && (jogadaCPU == 2))
		return false;
	
	return true;
	
}

/* Imprime no console a frase de 'derrota' + a pontuação total */
function dialogo_perdeu() {
	
	console.log("Você perdeu! A sua pontuação foi de " + pontuacao);
	
}

/* Loop do jogo principal */
while (true) {
	
	/* Imprime as opções na tela */
	escolhas.forEach( function (valor,chave) { console.log((chave+1) + " - " + valor); } );
	
	/* Lendo a escolha do jogador */
	input = parseInt(prompt());
	
	/* Aqui verifico se o usuário clicou no botão 'Cancelar' no popup de input */
	if (isNaN(input)) {
		console.log("Jogo encerrado! Pontuação: " + pontuacao);
		break;
	}
	
	/* Verificando se a escolha do jogador é válida */
	if ( (input < 1) || (input > 3) ) {
		dialogo_perdeu();
		break;
	}
	
	/* CPU escolhendo um valor aleatório entre 0 e 2 (por causa das posições do vetor) */
	escolhaCPU = Math.floor( Math.random() * 3 );
	
	/* Imprimindo a escolha da CPU */
	console.log("O computador jogou " + escolhas[escolhaCPU]);
	
	/* Verificando se houve empate. Aqui incremento a variável 'escolhaCPU' para se enquadrar nas escolhas de usuário */
	if (input == ++escolhaCPU)
		console.log("A rodada empatou!");
	
	/* Se não houve empate, verifico se o usuário ganhou a rodada. Se sim, imprimo a frase de 'sucesso' e incremento a pontuação, */
	else if (jokenpo(input,escolhaCPU)) {
		console.log("Você ganhou!");
		pontuacao++;
	}
	
	/* senão, invoco o 'dialogo_perdeu()' e encerro o jogo */
	else {
		dialogo_perdeu();
		break;
	}
	
}
