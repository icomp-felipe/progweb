module.exports = async function (req, res) {
	
	var autor = "Felipe André";
	var lancamento = "2019";

	res.view('pages/trex-sobre', {dados: [{author: autor},{release_date: lancamento}]});
}
