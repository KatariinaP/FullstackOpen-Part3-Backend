const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://katapiip:${password}@cluster0.rd5zu.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('contact', contactSchema)


if (process.argv.length===5){
  const newName = process.argv[3]
  const newNumber = process.argv[4]
  const contact = new Contact({
    name: newName,
    number: newNumber
  })
  contact.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if( process.argv.length === 3 ){
  console.log('phonebook:')
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
}
