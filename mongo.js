const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>',
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.l8nod.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

const entryName = process.argv[3];

const entryNumber = process.argv[4];

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: entryName,
  number: entryNumber,
});

person
  .save()
  .then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    return Person.find({});
  })
  .then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
