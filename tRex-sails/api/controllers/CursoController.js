module.exports = {

    /** Apenas lista os cursos cadastrados na base de dados */
    index: async function (req,res) {

        var cursos = await Curso.find();

        res.view('curso/index', {cursos:cursos});

    },

    /** Action multifuncional. Aqui é possível cadastrar um novo curso na base de dados */
    create: async function (req,res) {

        // Se recebi um "POST" vou tentar cadastrá-lo na base de dados
        if (req.method == "POST") {

            try {

                await Curso.create(req.allParams());
        
                res.redirect('/curso');

            }
            catch (error) {
                console.log("Deu ruim :(");
            }

        }
        else
            res.view('curso/create');

    },

    read: async function (req,res) {

        var id = req.param("cursoId");
        var curso = await Curso.findOne({id: id});

        console.log(`ID: ${curso.id}, Nome: ${curso.nome}, Sigla: ${curso.sigla}, Descrição: ${curso.descricao}`);

    },

    update: async function (req,res) {

        if (req.method == "POST") {

            try {

                var id = req.param("cursoId");
                await Curso.update({id: id}).set(req.allParams());

                res.redirect('/curso');

            }
            catch (error) {
                console.log(`Falha ao atualizar registro ${id}`);
            }

        }
        else {

            try {

                var id = req.param('cursoId');
                var curso = await Curso.findOne({id: id});

                if (!curso)
                    console.log(`Não achei o registro ${id}`);
                else
                    res.view('curso/update',{curso: curso});

            }
            catch (error) {
                console.log(`Não achei o registro ${id}`);
            }

        }

    },

    delete: async function (req,res) {

        var id = req.param('cursoId');
        await Curso.destroy({id: id});

        res.redirect('/curso');

    }
  
};