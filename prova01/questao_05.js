class Empregado {
	
	constructor(nome,salario) {
		this.nome = nome;
		this.salario = (salario >= 0.0) ? salario : 0.0;
	}
	
	setNome(nome) {
		this.nome = nome;
	}
	
	setSalario(salario) {
		this.salario = (salario >= 0.0) ? salario : 0.0;
	}
	
	getNome() {
		return this.nome;
	}
	
	getSalario() {
		return this.salario;
	}

}

var inst1 = new Empregado("Felipe",-0.0000001);
var inst2 = new Empregado("Davi",5000.00);


console.log(inst1.getSalario());
console.log(inst2.getSalario());

inst1.setSalario( inst1.getSalario() * 1.1 );
inst2.setSalario( inst2.getSalario() * 1.1 );

console.log(inst1.getSalario());
console.log(inst2.getSalario());
