module.exports = async function (req,res) {

    var ranking = await Jogada.find();
    res.view('pages/ranking',{ranking:ranking});

}