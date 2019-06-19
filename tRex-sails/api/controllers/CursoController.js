/**
 * CursoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    index: async function (req,res) {

        var cursos = await Curso.find();

        res.view('curso/index', {cursos:cursos});

    },

    create: async function (req,res) {

        if (req.method == "POST") {

            var params = req.allParams();

            console.log(params.input_nome);

            console.log('executei o POST caraio');

        }
        else
            res.view('curso/create');

    },

    read: async function (req,res) {
        res.end(req.param("cursoId"));
    },

    update: async function (req,res) {},

    delete: async function (req,res) {}
  
};