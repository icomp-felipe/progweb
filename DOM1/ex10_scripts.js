/************************************************
*   Cálculo de Circunferência utilizando DOM    *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 03/05/2019                           *
*************************************************/

/** Programação do comportamento do botão ao ser pressionado. */
button_ok.onclick = function() {
	
	// Obtendo o raio do input_text
	let raio = parseFloat(input_raio.value);
	
	// Cálculo das circunferências e área
	let circ = Math.PI * raio * 2;
	let area = Math.PI * Math.pow(raio,2);
	
	// Mostrando os resultados nos input_text da view com 2 casas decimais
	input_area.value = area.toFixed(2);
	input_circ.value = circ.toFixed(2);
	
	// Aqui retorno 'false' para não atualizar a página durante a submissão do 'form'
	return false;
}
