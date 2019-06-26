module.exports = {
  
    trex: async function(req,res) {
        res.view('pages/game/trex');
    },

    salvarPontuacao: async function(req,res) {

        await Jogada.create({
            jogador  : req.me.id,           // ID do jogador no banco de dados
            pontuacao: req.body.pontuacao
        });

        res.end("Pontuacao salva: " + req.body.pontuacao);

    },

    recuperaPontuacao: async function(req,res) {

        // select pontuacao from jogada order by pontuacao desc limit 1
        var max = await Jogada.find({ select: ['pontuacao'], sort: 'pontuacao DESC', limit: 1});
        res.end(`${max[0].pontuacao}`);

    }

};

