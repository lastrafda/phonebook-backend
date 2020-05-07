const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI


console.log('connecting to ', url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch(error => {
		console.log('Error connecting to MongoDB:', error.message);
	})

	const personSchema = new mongoose.Schema({
		name: {
			type: String,
			minlength: 3,
			required: true
		},
		number: {
			type: String,
			required: true
		}
	})

	personSchema.set('toJSON', {
		transform: (document, returnedObject) => {
			returnedObject.id = returnedObject._id.toString()
			delete returnedObject._id
			delete returnedObject.__v
		}
	})
	
	module.exports = mongoose.model('Person', personSchema)