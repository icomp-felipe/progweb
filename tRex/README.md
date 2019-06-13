# T-Rex Runner Game

Bem vindo ao jogo do T-Rex Runner multidispositivos.

## Introdução

O T-Rex Running da Disciplina Programação WEB foi inspirado no
famoso jogo do dinossauro do Google Chrome que, por sua vez, pode
ser um ótimo passatempo quando a internet cai.
Desenvolvido por [Felipe André](mailto:fass@icomp.ufam.edu.br) em 2019 utilizando
as tecnologias HTML5, CSS3 e ECMAScript 8, este divertido
game pode ser desfrutado pelo usuário nos mais diversos navegadores e
dispositivos incluindo celulares, tablets e televisores!

### Pré-requisitos

O cliente deve estar executando em um browser com ao menos suporte ao ECMAScript 8!

## Implementação Obrigatória

1. Antes de iniciar a partida, o T-Rex está parado e posicionado à esquerda do deserto,
com a pontuação corrente do jogador zerada;
2. Quando o jogado pressiona o botão de seta para cima ou barra de espaço
(ou desliza para cima no caso de touchscreen e trackpad), o jogo inicia e a pontuação
corrente começa a ser incrementada a cada 30 frames passados. O canto direito do cenário
mostra a pontuação atual com as fontes disponíveis nos sprites;
3. A corrida sem fim do T-Rex ocorre de dia e de noite. O cenário troca de turno a cada 60
segundos, virando dia se era noite e noite se era dia;
4. A velocidade do T-Rex aumenta a cada 1000 frames passados. A proporção com que a velocidade
aumenta é de 0.05px de deslocamento de sprites;
5. Os obstáculos do caminho do T-Rex são:
* **Cactos:** podem vir sozinhos ou em grupos de 2, 3 ou 4 cactos, também com tamanhos variados;
* **Pterossauros:** vêm batendo asas em 3 altitudes possíveis: uma na altura do T-rex, onde este
deve pular para evitar uma colisão, uma um pouco acima do T-Rex onde este pode agachar para não
colidir e, por fim, uma acima do T-Rex, onde ele não colide se não pular.
* **Lembrando** que o aparecimento dos obstáculos ocorre de forma aleatória a cada 300 frames mínimos de distância entre si, para que seja possível o T-Rex escapar deles através de seus pulos ou agachamentos.
6. O T-Rex é capaz de pular ou agachar para escapar dos obstáculos;
7. O cenário do jogo possui algumas nuvens que, da mesma forma que os obstáculos, vão sendo ultrapassados pelo T-Rex. Note que as nuvens andam no sentido contrário ao do T-Rex com metade de sua velocidade;
8. O jogo pode ser pausado ao pressionar a tecla "P";
9. O jogo termina (game over) quando o T-Rex colide com algum obstáculo. Quando isso acontece, a imagem do T-Rex muda (fica assustado), e a mensagem de game over e o botão de restart aparece na tela. Se o jogador clicar no botão de restart, a pontuação atual é zerada e um novo jogo é iniciado.

## Implementação Adicional

1. O jogo pode ser executado em dispositivos móveis compatíveis com a tecnologia ECMAScript 8;
2. Foi implementado suporte a touchscreen e trackpad, dando flexibilidade de execução nos mais diversos dispositivos;
3. Todo o código está comentado para facilitar possíveis correções e aperfeiçoamentos;
4. Foram adicionados ao jogo os áudios originais (extraídos do Google Chrome);
5. A pontuação emite um alerta sonoro e pisca 4x a cada 100 pontos acumulados, da mesma forma que no Google Chrome;
6. Todo o jogo foi projetado utilizando técnicas de Autômatos e Máquinas de Estados, de forma que os componentes são sincronizados a um 'clock' global determinado pelos frames da aplicação;
7. Além da velocidade, à medida que a pontuação do jogador é acrescida, a probabilidade com que os obstáculos aparecem também aumenta, tornando o jogo bem mais interessante;
8. A velocidade máxima do jogo (modo insano) é de 3000 FPS.

## Próximos Passos

* Controle mais acurado da velocidade e dificuldade do jogo;
* Melhoria do tratamento de colisões utilizando sobreposição de imagens PNG com transparência;
* Melhorias de desempenho de código.

## Autor

* **Felipe André**: [fass@icomp.ufam.edu.br](mailto:fass@icomp.ufam.edu.br)