const mongoose = require("mongoose");

const url = process.env.MONGODB_URI

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model("Person", {
  name: String,
  number: String
});


Person.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  };
};

module.exports = Person;

mongodb://otter:hurraamongo@ds117178.mlab.com:17178/fullstack-harjoitus