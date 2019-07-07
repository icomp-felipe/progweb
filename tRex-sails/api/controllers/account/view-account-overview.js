module.exports = async function (req,res) {

    var curso = await Curso.findOne({id: req.me.curso});

    res.view("pages/account/account-overview",{ curso: curso.nome });
};