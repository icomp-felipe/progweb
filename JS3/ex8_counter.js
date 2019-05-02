/************************************************
*   Implementação de Contador Usando Closure    *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 26/04/2019                           *
*************************************************/

/* Definição da função 'counter' */
function counter(start) {
	
	/* Definição da variável 'privada' */
	let count = start;
	
	/* Definição da função 'increment()' */
	return function increment() {
		return(++count);
	}
	
}

/* Atribuindo a função 'increment()' à variável 'incrementar' */
var incrementar = counter(1);

/* Acessando 'increment()' e por consequência, a
   variável privada count a partir do escopo global */
console.log('Primeira chamada ' + incrementar());
console.log('Segunda chamada '  + incrementar());
console.log('Terceira chamada ' + incrementar());