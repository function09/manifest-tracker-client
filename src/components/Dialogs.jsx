import ItemsTable from './ItemsTable';
import { Dialog, Button, Form, FormItem, Input, List, Text, StandardListItem } from '@ui5/webcomponents-react';
import { useState } from 'react';
import { createNewUser, login } from '../networkRequests/fetchRequests';
import '@ui5/webcomponents/dist/features/InputElementsFormSupport.js';
import { saveSessionToStorage } from '../localStorage/localStorage';

function ErrorDialog({ errorMessage, errorStatus, errorDialogOpen, setErrorDialogOpen }) {
  function closeErrorDialog() {
    setErrorDialogOpen(false);
  }
  return (
    <Dialog
      open={errorDialogOpen}
      headerText={`Error: ${errorStatus}`}
      footer={<Button onClick={closeErrorDialog}>Close</Button>}
    >
      <List>
        {errorMessage && Array.isArray(errorMessage) ? (
          errorMessage.map((error, index) => <StandardListItem key={index}>{error}</StandardListItem>)
        ) : (
          <StandardListItem>
            {typeof errorMessage === 'string' ? errorMessage : 'An unknown error occurred.'}
          </StandardListItem>
        )}
      </List>
      {/* {errorMessage} */}
    </Dialog>
  );
}

function ItemsDialog({ isOpen, setIsOpen, itemData, header }) {
  function closeItemDialog() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      headerText={`Document Number: ${header}`}
      footer={<Button onClick={closeItemDialog}>Close</Button>}
    >
      <ItemsTable data={itemData} header={header} />
    </Dialog>
  );
}

function LoginDialog({ isOpen, onClose, onLogin, openCreateUserDialog, setErrorMessage, errorMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    // Reset state when a user logs in for username, password
    try {
      const data = await login(username, password);
      const userId = await data.message.user.id;

      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        saveSessionToStorage(userId);
        onClose();
        onLogin(data.message);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage('Failed to connect to the server');
    }
  }

  return (
    <Dialog
      open={isOpen}
      headerText="Login" /*THERE IS A BUG WHERE IF ESCAPE IS PRESSED THE DIALOG STATE DOES NOT CHANGE*/
      footer={
        <Text>
          New user?
          <Button design="Transparent" onClick={openCreateUserDialog}>
            Create an account!
          </Button>
        </Text>
      }
    >
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      <Form onSubmit={handleLogin}>
        <FormItem label="Username">
          <Input
            type="Text"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </FormItem>
        <FormItem label="Password">
          <Input
            type="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </FormItem>
        <Button style={{ width: '4rem' }} type="Submit">
          Log in
        </Button>
      </Form>
    </Dialog>
  );
}

function LogOutDialog({ isOpen, logOutMessage, handleClose }) {
  return (
    <Dialog headerText="Log out" open={isOpen} footer={<Button onClick={handleClose}>Close</Button>}>
      <Text>{logOutMessage}</Text>
    </Dialog>
  );
}

function NewUserDialog({ isOpen, openLoginDialog, setErrorMessage, errorMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleCreateUser(event) {
    event.preventDefault();
    try {
      const newUser = await createNewUser(username, password);

      if (!newUser.success) {
        setErrorMessage(newUser.message);
      } else {
        setErrorMessage('');
        setUsername('');
        setPassword('');
        openLoginDialog();
        return newUser;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog
      open={isOpen}
      headerText="Create a new user"
      footer={
        <Text>
          Already have an account?{' '}
          <Button design="Transparent" onClick={openLoginDialog}>
            Login!
          </Button>
        </Text>
      }
    >
      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      <Form onSubmit={handleCreateUser}>
        <FormItem label="Username">
          <Input
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          ></Input>
        </FormItem>
        <FormItem label="Password">
          <Input
            type="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          ></Input>
        </FormItem>
        <Button style={{ width: '4rem' }} type="Submit">
          Submit
        </Button>
      </Form>
    </Dialog>
  );
}
export { ErrorDialog, ItemsDialog, LoginDialog, LogOutDialog, NewUserDialog };
