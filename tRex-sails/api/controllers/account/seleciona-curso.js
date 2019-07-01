module.exports = async function selecionarCurso(req, res) {

  if (req.method == "POST") {

    var id_curso = req.body.combo_id_curso;

    await User.update({id: req.me.id}).set({curso: id_curso});

    res.redirect("/account");

  }
  else {

    var cursos = await Curso.find();
    res.view('pages/account/seleciona-curso',{cursos:cursos});
    
  }

};
