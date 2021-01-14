const mongoose = require('mongoose');
const schema = mongoose.Schema;


const catSchema = schema({
    categories: {type: Array, default: []},
    selector: {type: String, default: 'catgs'}
});


module.exports = mongoose.model('category', catSchema);
