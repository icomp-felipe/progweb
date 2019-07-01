module.exports = {
  
    trex: async function(req,res) {
        res.view('pages/homepage-trex');
    },

    /** Exibe o ranking das jogadas */
    ranking: async function(req,res) {

        var ranking = await Jogada.find().populate('jogador');
        res.view('pages/ranking',{ranking:ranking});

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

