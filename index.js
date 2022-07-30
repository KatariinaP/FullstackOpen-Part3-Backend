const express = require('express')
const app = express()
app.use(express.json())

var morgan = require('morgan')

morgan.token('contact', (request, response) => {
  return JSON.stringify(request.body)
})

const cors = require('cors')

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))

let persons =  [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Helloy World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<h1>Phonebook has info for ${persons.length} people <p>${date}</p> </h1>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const contact = persons.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(contact => contact.id !== id)
  response.status(204).end()
})

const generateId = () => {
  let randomId = Math.floor(Math.random() * 1001)
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json(
      { error: 'name or number missing' }
      )
  }
  else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json(
      { error: 'name must be unique' }
      )
  } 
  
  const newContact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newContact)

  response.json(newContact)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})