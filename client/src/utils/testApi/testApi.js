const { URLS } = require("../enum")

module.exports.logout = async () => {
  return this.postRequest(URLS.logout, null)
}

module.exports.checkSession = async () => {
  return this.postRequest(URLS.checkSession, null)
}

module.exports.deleteItem = async (data) => {
  return this.deleteRequest(URLS.deleteItem, data)
}

module.exports.deleteList = async (data) => {
  return this.deleteRequest(URLS.deleteList, data)
}

module.exports.getAllLists = async (data) => {
  return this.getRequest(`${URLS.getListsUri}?userId=${data.userId}&containerId=${data.containerId}`, null)
}

module.exports.getPublicList = async (data) => {
  return this.getRequest(`${URLS.getPublicListUri}?containerId=${data?.containerId}&listId=${data?.listId}&cx=${data?.cx}`, null)
}

module.exports.deletePublicItem = async (data) => {
  return this.deleteRequest(`${URLS.deletePublicItem}?containerId=${data?.containerId}&listId=${data?.listId}&cx=${data?.cx}`, data)
}

export const postRequest = async (url, data) => {
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
    if (response.status === 403) {
      return {
        status: response.status,
        message: "Unauthorized user",
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

module.exports.getRequest = async(url) => {
  const response = await fetch(
    url,
    { credentials: "include" }
  ).catch((e) => {
    return { status: e.status }
  })

  if (response.status !== 200) {
    if (response.status === 403) {
      return {
        status: response.status,
        message: "Unauthorized user",
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

module.exports.deleteRequest = async (url, data) => {
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
    if (response.status === 403) {
      return {
        status: response.status,
        message: "Unauthorized user",
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

