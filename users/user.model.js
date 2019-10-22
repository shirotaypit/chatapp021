const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const schema = new Schema({
	  _id: { type: Number },
    nickName: { type: String, unique: true, required: true },
    passCode: { type: String, required: true },
	userImage: {type: String}
 
}, { _id: false });
schema.plugin(AutoIncrement, {start_seq : 2});
schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('user', schema);