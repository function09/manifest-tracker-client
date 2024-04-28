const baseURL = 'https://manifest-tracker-api-delicate-fog-249.fly.dev';

const urls = {
  manifests: `${baseURL}/api/v1/manifests`,
  items: (UUID) => `${baseURL}/api/v1/manifests/${UUID}`,
  uploadManifest: `${baseURL}/api/v1/manifests/upload`,
  updateManifest: (UUID) => `${baseURL}/api/v1/manifests/update/${UUID}`,
  deleteManifest: (UUID) => `${baseURL}/api/v1/manifests/delete/${UUID}`,
  login: `${baseURL}/users/login`,
  logout: `${baseURL}/users/logout`,
  createUser: `${baseURL}/users/create`,
  session: `${baseURL}/users/session`,
};

const fetchManifests = async () => {
  const fetchOptions = {
    method: 'GET',
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.manifests, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, data: result.message };
    } else {
      return { success: true, status: response.status, data: result.data };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const fetchItems = async (UUID) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  // clean all of this up
  try {
    const response = await fetch(`${urls.manifests}/${UUID}`, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      // Don't need anything but the document number,items, and UUID fix this in the API
      return { success: true, status: response.status, data: result.data };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const uploadManifest = async (event) => {
  /*
    Sedialect the file, create a new form data object, 
    use the form data object to send the file to the server for processing
  */

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const formData = new FormData();

  // consider changing "file" to "manifest" in both server-side and client
  formData.append('file', file);

  const fetchOptions = {
    method: 'POST',
    credentials: 'include',
    body: formData,
  };

  try {
    const response = await fetch(urls.uploadManifest, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      event.target.value = '';
      return { success: false, status: response.status, message: data.message };
    } else {
      event.target.value = '';
      return { success: true, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

//Change this to updateMaterialDocument
const editMaterialDocument = async (UUID, materialDocNumber) => {
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ materialDocNumber }),
    credentials: 'include',
  };
  try {
    const response = await fetch(urls.updateManifest(UUID), fetchOptions);
    const result = await response.json();
    if (!response.ok) {
      const errorMessages = Array.isArray(result.message)
        ? result.message.map((message) => message.msg)
        : [result.message];
      return { success: false, status: response.status, message: await errorMessages };
    }
    return { success: true, data: result };
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const deleteManifests = async (UUID) => {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.deleteManifest(UUID), fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: data.message };
    } else {
      return { success: true, status: response.status, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const login = async (username, password) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.login, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      //Need to fix endpoint structure
      return { success: true, status: response.status, message: result };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const logOut = async () => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.logout, fetchOptions);
    const result = await response.json();
    if (!response.ok) {
      return { success: false, status: response.status, message: result.message };
    } else {
      return { success: true, status: response.status, message: result.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const createNewUser = async (username, password) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.createUser, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, status: response.status, message: data.message };
    } else {
      return { success: true, status: response.status, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

const fetchCurrentSession = async () => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(urls.session, fetchOptions);
    const data = await response.json();
    if (!response.ok) {
      return { success: false, status: response.status, message: data.message };
    } else {
      return { success: true, status: response.status, message: data.message };
    }
  } catch (error) {
    throw new Error('Failed to connect to the server:', error.message);
  }
};

export {
  fetchManifests,
  fetchItems,
  uploadManifest,
  editMaterialDocument,
  deleteManifests,
  login,
  logOut,
  createNewUser,
  fetchCurrentSession,
};
