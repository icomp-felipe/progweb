/************************************************
*   Mudando um Gráfico de Barras com JS e CSS   *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 03/05/2019                           *
*************************************************/

/** Definição do comportamento do botão */
button_desenha.onclick = () => {
	
	let y = [];
	
	// Recuperando os tamanhos a partir dos 'input_field' da view
	y[0] = parseInt(input_y1.value);
	y[1] = parseInt(input_y2.value);
	y[2] = parseInt(input_y3.value);
	y[3] = parseInt(input_y4.value);
	
	let x  = parseInt(input_x.value);
	
	// Recuperando as barras (divs)
	let divs = document.getElementsByTagName("div");
	
	// Atualizando o tamanho de cada barra
	for (let i=0; i<divs.length; i++) {
		
		divs[i].style.height = (y[i] + "px");
		divs[i].style.width  = (x    + "px");
	}
	
	return false;
}
