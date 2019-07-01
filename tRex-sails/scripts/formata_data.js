function formata_data(raw_date) {

	var ano = raw_date.substring(0,4);
	var mes = raw_date.substring(5,7);
	var dia = raw_date.substring(8,10);
	
	var hora = raw_date.substring(11,13);
	var min  = raw_date.substring(14,16);
	var seg  = raw_date.substring(17,19);
	
	return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;

}

console.log(formata_data("2019-06-27T04:18:29.177Z"));
