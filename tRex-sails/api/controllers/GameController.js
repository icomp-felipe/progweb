module.exports = {
  
    trex: async function(req,res) {
        res.view('pages/trex-game');
    },

    /** Exibe o ranking das jogadas */
    ranking: async function(req,res) {

        var lista = [];
        var ranking = await Jogada.find().populate('jogador');

        for (var i=0; i<ranking.length; i++) {
            lista[i] = [];
            lista[i].fullName = ranking[i].jogador.fullName;
            lista[i].pontuacao = ranking[i].pontuacao;
            lista[i].data = await sails.helpers.dateFormatter(ranking[i].data);
        }

        res.view('pages/trex-ranking',{ranking:lista});

    },

    /** Salva a pontuação máxima do jogador na base de dados */
    salvarPontuacao: async function(req,res) {

        await Jogada.create({
            jogador  : req.me.id,           // ID do jogador no banco de dados
            pontuacao: req.body.pontuacao
        });

    },

    /** Devolve a pontuação máxima do game */
    recuperaPontuacao: async function(req,res) {

        // select pontuacao from jogada order by pontuacao desc limit 1
        var max = await Jogada.find({ select: ['pontuacao'], sort: 'pontuacao DESC', limit: 1});

        if (max)
            res.end(`${max[0].pontuacao}`);
        else
            res.end('0');

    }

};

