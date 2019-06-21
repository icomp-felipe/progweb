module.exports = async function selecionarCurso(req, res) {

  if (req.method == "POST") {

    console.log("cu");

  }
  else {

    var cursos = await Curso.find();
    res.view('pages/account/curso',{cursos:cursos});
    
  }

};
