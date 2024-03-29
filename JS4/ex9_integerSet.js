/************************************************
*       Operações com Classes e Conjuntos       *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 02/05/2019                           *
*************************************************/

/** Definição da classe 'IntegerSet' */
class IntegerSet {
	
	// Constrói a classe apenas...
	constructor (max_value) {
		
		// ...se 'max_value' for um número natural maior que zero.
		if ((typeof max_value === "number") && (max_value > 0)) {
			
			this.max_value = max_value;
			this.array = [];
			
			// Aqui inicializo o array com false
			for (let i = 0; i < this.max_value; i++)
				this.array.push(false);
			
		}
		else
			console.log("x Falha ao instanciar IntegerSet com valor '" + max_value + "'. Favor utilizar apenas números naturais!");
	
	}
	
	// Retorna o tamanho do IntegerSet
	getTamanho() {
		return this.max_value;
	}
	
	// Insere um número no IntegerSet
	insere(inteiro) {
		
		// Se o 'inteiro' for um número natural positivo até a capacidade deste IntegerSet...
		if ((typeof inteiro === "number") && (inteiro > 0) && (inteiro <= this.max_value))
			this.array[inteiro-1] = true;
		else
			console.log("[insere]: valor inválido ou fora do intervalo '" + inteiro + "'");
		
	}
	
	// Remove um número no IntegerSet
	remove(inteiro) {
		
		// Se o 'inteiro' for um número natural positivo até a capacidade deste IntegerSet...
		if ((typeof inteiro === "number") && (inteiro > 0) && (inteiro <= this.max_value))
			this.array[inteiro-1] = false;
		else
			console.log("[remove]: valor inválido ou fora do intervalo '" + inteiro + "'");
		
	}
	
	// Converte este IntegerSet para uma string
	toString() {
		
		let string = [];
		
		this.array.forEach( (v,k) => { if (v == true) string.push(k+1) } );
		
		return ('[' + string.join(',') + ']');
		
	}
	
	/** Helper que retorna um novo IntegerSet contendo a união de dois conjuntos informados via parâmetro */
	static uniao(conjunto1,conjunto2) {
		
		let tamanho  = Math.max(conjunto1.getTamanho(),conjunto2.getTamanho());
		let conjunto = new IntegerSet(tamanho);
		
		conjunto1.array.forEach( (v,k) => { if (v == true) conjunto.array[k] = true } );
		conjunto2.array.forEach( (v,k) => { if (v == true) conjunto.array[k] = true } );
		
		return conjunto;
	}
	
	/** Helper que retorna um novo IntegerSet contendo a remoção dos elementos de 'conjunto2' de 'conjunto1' */
	static diferenca(conjunto1,conjunto2) {
		
		let conjunto = new IntegerSet(conjunto1.getTamanho());
		
		conjunto1.array.forEach( (v,k) => { if (v == true) conjunto.array[k] = !(conjunto2.array[k] == true) });
		
		return conjunto;
	}
	
	/** Helper que retorna um novo IntegerSet com a interseção dos conjuntos passados via parâmetro */
	static intersecao(conjunto1,conjunto2) {
	
		let tamanho  = Math.max(conjunto1.getTamanho(),conjunto2.getTamanho());
		let conjunto = new IntegerSet(tamanho);
	
		conjunto2.array.forEach( (v,k) => { if ((v == true) && (conjunto1.array[k] == true)) conjunto.array[k] = true } );
	
		return conjunto;
	}
	
}

/******************** Parte de Testes *********************************/

console.log("==> Instanciando classes...");

var i = new IntegerSet(10);
var j = new IntegerSet(15);
new IntegerSet('progweb');

console.log("\n==> Inserindo elementos...");
i.insere(5);
i.insere(7);
i.insere(8);
i.insere(10);

j.insere(2);
j.insere(5);
j.insere(7);
j.insere(10);
j.insere(15);

console.log("[i] = " + i.toString());
console.log("[j] = " + j.toString());

console.log("\n==> Interseção de conjuntos...");
console.log("[i ∩ j] = " + IntegerSet.intersecao(i,j).toString());

console.log("\n==> Removendo número '2' de [j]...");
j.remove(2);
console.log("[j] = " + j.toString());

console.log("\n==> União de conjuntos...");
console.log("[i ∪ j] = " + IntegerSet.uniao(i,j).toString());

console.log("\n==> Diferença de conjuntos...");
console.log("[i - j] = " + IntegerSet.diferenca(i,j).toString());
