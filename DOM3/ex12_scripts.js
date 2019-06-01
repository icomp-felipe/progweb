/************************************************
*   Trabalhando com EventListener e Mouseover   *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 01/06/2019                           *
*************************************************/

// Vetor de pontos
var pontos = [];

/** Responsável controlar o desenho dos pontos.
 *  Controlo este tamanho utilizando uma fila .  */
function draw(ponto) {

    // Se já tenho 8 pontos desenhados, removo o primeiro que entrou
    if (pontos.length == 8)
        document.body.removeChild(pontos.shift());

    // Desenhando o novo ponto e adicionando no rabo da fila
    document.body.appendChild(ponto);
    pontos.push(ponto);

}

/** Controla os eventos de mouseover */
addEventListener("mouseover",function(event) {

    // A cada 'mouseover', crio uma div...
    var ponto = document.createElement("div");

    // ... defino classe e posição e...
    ponto.className = "dot";
    ponto.style.left = (event.pageX - 4) + "px";
    ponto.style.top  = (event.pageY - 4) + "px";

    // ... desenho
    draw(ponto);

});