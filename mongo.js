const mongoose = require('mongoose')

const argumentsLength = process.argv.length

if (argumentsLength > 3 && argumentsLength < 5) {
  console.log('Missing arguments: run node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@fullstackopen-7qb5p.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = new mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
})
if (argumentsLength === 3) {
  Person.find({}).then( persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(person => {
    console.log('person saved!')
    console.log('person', person)
    mongoose.connection.close()
  })
}
