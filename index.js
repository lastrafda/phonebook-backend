const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const app = express()
const cors = require('cors')

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
require('dotenv').config()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { stream: accessLogStream }))

const Person = require('./models/person')
const PORT = process.env.PORT

app.get('/info', (req, res) => {
	const total = persons.length
	res.send(`<p>Phonebook has info for ${total} people</p><br><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
	Person.find({})
		.then( persons => {
			res.json(persons.map(p => p.toJSON()))
		})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person.toJSON())
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})
	person.save()
		.then(savedPerson => savedPerson.toJSON())
		.then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req,res) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true})
		.then( updatedPerson => res.json(updatedPerson.toJSON()))
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => res.status(204).end())
		.catch(error => next(error))
})

const unkownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unkownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})