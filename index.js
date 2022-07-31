require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')
app.use(express.json())

app.use(express.static('build'))

var morgan = require('morgan')

morgan.token('contact', (request, response) => {
  return JSON.stringify(request.body)
})

const cors = require('cors')

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))






app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<h1>Phonebook has info for ${persons.length} people <p>${date}</p> </h1>`)
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  })

/*  const id = Number(request.params.id)   
  const contact = persons.find(contact => contact.id === id)
  if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  } */

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(contact => contact.id !== id)
  response.status(204).end()
})

/* const generateId = () => {
  let randomId = Math.floor(Math.random() * 1001)
  return randomId
} */

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json(
      { error: 'name or number missing' }
      )
  }
/*  else if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json(
      { error: 'name must be unique' }
      )
  } */
  
  const newContact = new Contact ({
    name: body.name,
    number: body.number,
  })

  newContact.save().then(savedContact => {
    response.json(savedContact)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})