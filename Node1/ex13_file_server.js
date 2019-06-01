/************************************************
*   Trabalhando com Módulos e Servidor Node.js  *
*************************************************
* Autor  : Felipe André Souza da Silva          *
* e-mail : fass@icomp.ufam.edu.br               *
* Criação: 01/06/2019                           *
*************************************************/

// Importando módulos
var fs = require('fs');
var http = require('http');
const serverPort = 3000;

// Recuperando o diretório
var path = process.argv[2];

// Verifica se o endereço passado é acessível
if (!fs.existsSync(path)) {
    console.error("x O diretório informado não é válido ou não está acessível!");
    return;
}

/** Função recursiva síncrona que lista um diretório
 *  para dentro de um vetor de strings */
var caminha = function(diretorio) {

    var arquivos = [];
    var lista    = fs.readdirSync(diretorio);

    // Varrendo a lista de arquivos
    lista.forEach(function(arquivo) {

        // Montando o caminho do arquivo
        arquivo = (diretorio + '/' + arquivo);

        // Recuperando o tipo de nó (diretório ou arquivo)
        var stat = fs.statSync(arquivo);

        // Dependendo do tipo de nó, entro num subdiretório ou apenas cadastro o arquivo na lista
        if (stat && stat.isDirectory()) {
            arquivos.push("[DIR] " + arquivo);
            arquivos = arquivos.concat(caminha(arquivo));
        }
        else
            arquivos.push("[ARQ] " + arquivo);
        
    });

    return arquivos;
}

/** Lendo diretório e criando servidor */
var arquivos = caminha(path);

console.log(`:: Diretório '${path}' lido com sucesso!`);
console.log(`:: Servidor HTTP instanciado na porta ${serverPort}. Pressione 'CTRL+C' para encerrar.`);

var server = http.createServer(function(req,res) {
        arquivos.forEach((valor) => res.write(`${valor}\n`,"utf-8"));
        res.end();
    }
).listen(serverPort);