const { URLS } = require("../enum")

const logout = async () => {
  return postRequest(URLS.logout, null)
}

const checkSession = async () => {
  return postRequest(URLS.checkSession, null)
}

const deleteItem = async (data) => {
  return deleteRequest(URLS.deleteItem, data)
}

const deleteList = async (data) => {
  return deleteRequest(URLS.deleteList, data)
}

const getAllLists = async (data) => {
  return getRequest(`${URLS.getListsUri}?userId=${data.userId}&containerId=${data.containerId}`, null)
}

const getPublicList = async (data) => {
  return getRequest(`${URLS.getPublicListUri}?containerId=${data?.containerId}&listId=${data?.listId}&cx=${data?.cx}`, null)
}

const deletePublicItem = async (data) => {
  return deleteRequest(`${URLS.deletePublicItem}?containerId=${data?.containerId}&listId=${data?.listId}&cx=${data?.cx}`, data)
}

const lookupUser = async (data) => {
  return postRequest(URLS.lookupUser, data)
}

const addPeopleToList = async (data) => {
  return postRequest(URLS.addPeople, data)
}

const removePeopleFromList = async (data) => {
  return deleteRequest(URLS.removePeople, data)
}

const postRequest = async (url, data) => {
  const options = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  }

  const response = await fetch(url, options).catch((e) => {
    return { status: e.status }
  })

  if (response.status !== 200) {
    if (response.status === 403 || response.status === 401) {
      return {
        status: response.status,
        message: "Unauthorized user",
      }
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: "Illegal argument sent to server",
      }
    } else if (response.status === 201) {
      return {
        status: response.status,
        message: "Not found",
      }
    } else {
      return {
        status: 500,
        message: "Error connecting to server",
      }
    }
  }

  const responseJson = await response.json() // parses JSON response into native JavaScript

  // console.log(responseJson)

  return responseJson
}

const getRequest = async(url) => {
  const response = await fetch(
    url,
    { credentials: "include" }
  ).catch((e) => {
    return { status: e.status }
  })

  if (response.status !== 200) {
    if (response.status === 403 || response.status === 401) {
      return {
        status: response.status,
        message: "Unauthorized user",
      }
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: "Illegal argument sent to server",
      }
    } else if (response.status === 201) {
      return {
        status: response.status,
        message: "Not found",
      }
    } else {
      return {
        status: 500,
        message: "Error connecting to server",
      }
    }
  }

  const responseJson = await response.json() // parses JSON response into native JavaScript

  // console.log(responseJson)

  return responseJson
}

const deleteRequest = async (url, data) => {
  const options = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  }

  const response = await fetch(
    url,
    options
  ).catch((e) => {
    return { status: e.status }
  })

  if (response.status !== 200) {
    if (response.status === 403 || response.status === 401) {
      return {
        status: response.status,
        message: "Unauthorized user",
      }
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: "Illegal argument sent to server",
      }
    } else if (response.status === 201) {
      return {
        status: response.status,
        message: "Not found",
      }
    } else {
      return {
        status: 500,
        message: "Error connecting to server",
      }
    }
  }

  const responseJson = await response.json() // parses JSON response into native JavaScript

  // console.log(responseJson)

  return responseJson
}

export {logout, checkSession, deleteItem, deleteList, getAllLists, getPublicList, deletePublicItem, postRequest, lookupUser, addPeopleToList, removePeopleFromList}
