const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const Person = require('./models/person');

// logger

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

const logger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    tokens.body(req, res, 'body'),
  ].join(' ');
});

app.use(express.json());
app.use(logger);
app.use(cors());
app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

/*
  Routes
  */

// /api/people

app.get('/api/people', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/people', (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log(savedPerson);
    response.json(savedPerson);
  });
});

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter((p) => p.id !== id);

  response.status(204).end();
});

// /info

app.get('/info', (request, response) => {
  const info = `<p>Phonebook has info for ${
    people.length
  } people</p>\n${new Date()}`;
  response.send(info);
});

// unknown endpoint

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// port

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
