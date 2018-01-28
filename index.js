const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(bodyParser.json());
app.use(express.static("build"));
app.use(cors());
app.use(
  morgan(function(tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.body(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms"
    ].join(" ");
  })
);

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      "<p>puhelinluettelossa on " +
        persons.map(Person.format).length +
        " henkilön tiedot</p><p>" +
        new Date() +
        "</p>"
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(Person.format));
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (note) {
        res.json(Person.format(person)).catch;
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      response.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson));
    })
    .catch(error => {
      console.log(error);
    });
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedperson => {
      res.json(Person.format(updatedperson));
    })
    .catch(error => {
      console.log(error);
      res.status(400).send({ error: "malformatted id" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
