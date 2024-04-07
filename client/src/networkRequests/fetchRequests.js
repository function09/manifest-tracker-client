// Add a loading modal to display as requests are being sent and processed by server
const fetchManifests = async (setData, setMessage, setDisplay, setIsEmpty, setError) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/manifests');

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const manifests = await response.json();

    //   Fix the message that displays
    const result = manifests.message;

    if (typeof result === 'string') {
      setData([]);
      setMessage(result);
      setDisplay(true);
    } else {
      setData(result);
      setIsEmpty(false);
      setDisplay(false);
    }
  } catch (error) {
    setError(error);
  }
};

const fetchItems = async (UUID, setDocumentNumber, setItems, setError) => {
  // clean all of this up
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/${UUID}`);

    if (!response.ok) {
      throw new Error('failed to fetch:', response.status);
    }

    const data = await response.json();
    // Don't need anything but the document number,items, and UUID fix this in the API
    const { documentNumber, items } = await data.message;
    setDocumentNumber(documentNumber);
    setItems(items);
  } catch (error) {
    setError(error);
  }
};

const uploadManifest = async (event, setMessage, setDisplay, setIsEmpty, setError, setData) => {
  /*
    Select the file, create a new form data object, 
    use the form data object to send the file to the server for processing
  */

  const file = event.target.files[0];

  if (!file) return;

  const formData = new FormData();

  // consider changing "file" to "manifest" in both server-side and client
  formData.append('file', file);

  const fetchOptions = {
    method: 'POST',
    credentials: 'include',
    body: formData,
  };

  try {
    const response = await fetch('http://localhost:3000/api/v1/manifests/upload', fetchOptions);

    if (!response.ok) {
      const result = await response.json();
      const errorMessage = result.message;
      setMessage(errorMessage);
      setDisplay(true);
      return;
    } else {
      setMessage('');
      await fetchManifests(setData, setMessage, setDisplay, setIsEmpty, setError);
      setDisplay(false);
    }
  } catch (error) {
    setError(error);
  }
};

const editMaterialDocument = async (UUID, materialDocNumber, setData, setMessage, setDisplay, setIsEmpty, setError) => {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ materialDocNumber }),
  };
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/update/${UUID}`, fetchOptions);

    if (!response.ok) {
      const result = await response.json();
      const errorMessage = result.message;
      console.log(errorMessage);
    }

    await fetchManifests(setData, setMessage, setDisplay, setIsEmpty, setError);
    return response;
  } catch (error) {
    setError(error);
  }
};

const deleteManifests = async (UUID, setData, setMessage, setDisplay, setIsEmpty, setError) => {
  const fetchOptions = { method: 'DELETE' };
  try {
    const response = await fetch(`http://localhost:3000/api/v1/manifests/delete/${UUID}`, fetchOptions);
    await fetchManifests(setData, setMessage, setDisplay, setIsEmpty, setError);
    return response;
  } catch (error) {
    setError(error);
  }
};

const loginRequest = async (username, password) => {
  const authHeader = 'Basic ' + btoa(username + ':' + password);

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(`http://localhost:3000/users/login`, fetchOptions);

    if (!response.ok) {
      throw new Error('Error during logon');
    }
  } catch (error) {
    console.log(error);
  }

  // After login, fetch all data to be displayed
};

const logOutRequest = async () => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch('http://localhost:3000/users/logout', fetchOptions);

    if (!response.ok) {
      throw new Error('Error during logout');
    }
  } catch (error) {
    console.log(error);
  }
};

export {
  fetchManifests,
  fetchItems,
  uploadManifest,
  editMaterialDocument,
  deleteManifests,
  loginRequest,
  logOutRequest,
};
