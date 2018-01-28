import React from "react";
import ReactDOM from "react-dom";
import personService from "./services/persons";
import "./index.css";

const Numbers = props => {
  return (
    <ul>
      {props.persons.map(person => (
        <Person key={person.name} person={person} onClick={props.onClick} />
      ))}
    </ul>
  );
};

const Person = props => {
  return (
    <li>
      {props.person.name} {props.person.number}{" "}
      <button onClick={() => props.onClick(props.person.id)}>Poista</button>
    </li>
  );
};

const Filter = props => {
  return (
    <div>
      Rajaa näytettäviä <input value={props.value} onChange={props.onChange} />
    </div>
  );
};

const Form = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        nimi: <input value={props.nameValue} onChange={props.nameOnChange} />
      </div>
      <div>
        numero:
        <input value={props.numberValue} onChange={props.numberOnChange} />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  );
};

const Notification = props => {
  if (!props.actionMade || props.error) {
    return null;
  }
  return <div className="message">{props.message}</div>;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      newName: "",
      newNumber: "",
      filter: "",
      error: false,
      actionMade: false,
      message: ""
    };
  }

  componentWillMount() {
    personService.getAll().then(persons => {
      this.setState({ persons });
    });
  }

  addPerson = event => {
    event.preventDefault();

    const personObject = {
      name: this.state.newName,
      number: this.state.newNumber
    };

    const names = this.state.persons.map(person => person.name);

    if (!names.includes(personObject.name)) {
      personService
        .create(personObject)
        .then(response => {
          this.setState({
            persons: this.state.persons.concat(response),
            newName: "",
            newNumber: "",
            actionMade: true,
            message: "Uuden henkilön lisääminen onnistui"
          });
          setTimeout(() => {
            this.setState({ actionMade: false });
          }, 5000);
        })
        .catch(error => {
          this.setState({
            error: true
          });
          setTimeout(() => {
            this.setState({ actionMade: false, error: false });
          }, 5000);
        });
    } else {
      if (
        window.confirm(
          `${
            this.state.newName
          } on jo luettelossa, korvataanko vanha numero uudella?`
        )
      ) {
        const person = this.state.persons.find(
          person => person.name === this.state.newName
        );
        const newPerson = { ...person, number: this.state.newNumber };

        personService
          .update(person.id, newPerson)
          .then(response => {
            this.setState({
              persons: this.state.persons.map(
                person => (person.id !== newPerson.id ? person : newPerson)
              ),
              newName: "",
              newNumber: "",
              actionMade: true,
              message: "Numeron muuttaminen onnistui"
            });
            setTimeout(() => {
              this.setState({ actionMade: false });
            }, 5000);
          })
          .catch(error => {
            personService.create(personObject).then(response => {
              personService.getAll().then(response => {
                this.setState({ persons: response });
              });
            });
          });
      }
    }
  };

  handleNewPerson = event => {
    this.setState({ newName: event.target.value });
  };

  handleNewNumber = event => {
    this.setState({ newNumber: event.target.value });
  };

  handleFilter = event => {
    this.setState({ filter: event.target.value });
  };

  deletePerson = id => {
    if (window.confirm("Haluatko poistaa henkilön?")) {
      personService
        .delet(id)
        .then(response => {
          this.setState({
            persons: this.state.persons.filter(person => person.id !== id),
            actionMade: true,
            message: "Henkilön poistaminen onnistui"
          });
          setTimeout(() => {
            this.setState({ actionMade: false });
          }, 5000);
        })
        .catch(error => {
          this.setState({
            error: true
          });
          setTimeout(() => {
            this.setState({ actionMade: false, error: false });
          }, 5000);
        });
    }
  };

  render() {
    let persons = this.state.persons;

    if (this.state.filter) {
      persons = this.state.persons.filter(person =>
        person.name.toLowerCase().match(this.state.filter.toLowerCase())
      );
    }

    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification
          message={this.state.message}
          actionMade={this.state.actionMade}
          error={this.state.error}
        />
        <Filter value={this.state.filter} onChange={this.handleFilter} />
        <h3>Lisää uusi numero</h3>
        <Form
          onSubmit={this.addPerson}
          valueName={this.state.newName}
          nameOnChange={this.handleNewPerson}
          valueNumber={this.state.newNumber}
          numberOnChange={this.handleNewNumber}
        />

        <h2>Numerot</h2>
        <Numbers persons={persons} onClick={this.deletePerson} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
