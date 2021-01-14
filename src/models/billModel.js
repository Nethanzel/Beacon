const mongoose = require('mongoose');
const schema = mongoose.Schema;

/*
const billSchema = new schema({

  rnc: {type: Number, require: true},
  r_social: {type: String, require: true},
  ncf: {type: String, require: true, unique: true},
  fecha: {type: Date, require: true},
  t_grabado: {type: Number, require: true},
  t_excento: {type: Number, require: true},
  prop_legal: {type: Number},
  itbis: {type: Number, require: true},
  t_facturado: {type: Number, require: true},
    //Extra
  bView: {type: String, require: false},
  category: {type: String, require: false, default: "no category"},
  consumo: {type: Boolean, require: true},
    //Security
  rUser: {type: String, require: true},
  rDate: {type: Date, require: true},

});
*/

const containerSchema = schema({

  selector: {type: Number, require: true, unique: true},
  data: {type: Array, require: true, default: []},

});



module.exports = mongoose.model("Billing", containerSchema);
/*
module.exports = function(collectionName) {
  return mongoose.model("Billing", billSchema, collectionName);
};
*/
