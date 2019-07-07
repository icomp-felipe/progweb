module.exports = {


  friendlyName: 'Date formatter',


  description: '',


  inputs: {

    data: {
      type: 'string',
      required: true
    },

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {

    var ano = inputs.data.substring(0,4);
    var mes = inputs.data.substring(5,7);
    var dia = inputs.data.substring(8,10);
        
    var hora = inputs.data.substring(11,13);
    var min  = inputs.data.substring(14,16);
    var seg  = inputs.data.substring(17,19);
        
    return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
    
  }


};

