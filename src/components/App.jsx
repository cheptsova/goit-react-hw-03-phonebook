import { Component } from 'react';
import { ContactsList } from './ContactsList';
import { ContactForm } from './ContactForm';
import { Filter } from './Filter';
import * as localStorage from './utils/localStorage';
import style from './AppContainer.module.css';

const CONTACTS_KEY = 'contacts';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    if (localStorage.read(CONTACTS_KEY)) {
      this.setState({
        contacts: localStorage.read(CONTACTS_KEY),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (contacts !== prevState.contacts) {
      localStorage.save(CONTACTS_KEY, contacts);
    }
  }

  onAddContact = contact => {
    if (this.state.contacts.some(item => item.name === contact.name)) {
      alert(`${contact.name} is already in contacts`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  onDeleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  onChangeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };

  getAddedContacts = () => {
    const { filter, contacts } = this.state;
    const toLowerCaseFilter = filter.toLocaleLowerCase();

    return contacts.filter(contact => {
      return contact.name.toLocaleLowerCase().includes(toLowerCaseFilter);
    });
  };

  render() {
    return (
      <div className={style.appContainer}>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.onAddContact} />
        <h2>Contacts</h2>
        <Filter value={this.state.filter} onChange={this.onChangeFilter} />
        <ContactsList
          contactsArr={this.getAddedContacts()}
          deleteContact={this.onDeleteContact}
        />
      </div>
    );
  }
}
