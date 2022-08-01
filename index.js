const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')
const Contact = require('./models/contact')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('contact', (request, response) => {
  return JSON.stringify(request.body)
})


app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :contact'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World, this is Phonebook backend</h1>')
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json(
      { error: 'name or number missing' }
      )
  }
 /* else if (persons.find((person) => person.name === body.name)) {
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

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(people => {
    response.json(people)
  })
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`<h1>Phonebook has info for ${persons.length} people <p>${date}</p> </h1>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    if (contact) {
      response.json(contact)
    } else {
      response.status(404).end()
    } 
  })
  .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    content: body.name,
    important: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})