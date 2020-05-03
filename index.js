const express = require('express')
const app = express()

app.use(express.json())

let persons = [
	{
		id: 1,
		name: 'Dan Abramov',
		number: '040-123456'
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523'
	},
	{
		id: 3,
		name: 'Arto Hellas',
		number: '12-43-234345'
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122'
	}
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

app.get('/info', (req, res) => {
	const total = persons.length
	res.send(`<p>Phonebook has info for ${total} people</p><br><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	if (person) {
		res.json(person)
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}
	const foundName = persons.find(p => {
		return p.name === body.name;
	})
	if (foundName) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		id: getRandomInt(1000000),
		name: body.name,
		number: body.number
	}
	persons = persons.concat(person)
	res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)

	res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
})