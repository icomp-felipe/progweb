/************************************************
*               Tabuada em JS                   *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 17/04/2019                           *
*************************************************/

/* Laço mais externo criando as tabelas */
for (i = 1; i<=10; i++) {
	
	document.write('<table border="1"><tr><td colspan=2>Produtos de ' + i + ' </td></tr>');
	
	/* Laço mais interno povoando as tabelas */
	for (j = 1; j<=10; j++)
		document.write('<tr><td align="center">' + i + 'x' + j + '</td><td align="center">' + (i*j) + '</td></tr>');
	
	document.write('</table>');	
	
}


