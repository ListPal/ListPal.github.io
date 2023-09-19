module.exports.mobileWidth = "480px";

module.exports.groceryContainerTypes = {
  todo: "TODO",
  whishlist: "WISHLIST",
  grocery: "GROCERY",
};

module.exports.groceryListScopes = {
  public: "PUBLIC",
  private: "PRIVATE",
  restricted: "RESTRICTED",
};

module.exports.borderColors = [
  "#7b9370",
  "#F0B323",
  "#30C8C9",
  "#CC801F",
  "#13707e",
  "#ff9466",
  "#133857",
  "#42062a",
  "#aff5b4",
  "#FF6969",
];

module.exports.dialogues = {
  closed: null,
  addItem: "addItem",
  deleteList: "deleteList",
  editItem: "editItem",
  deleteItem: "deleteItem",
  select: "selectItem",
  editList: "editList",
  addPeople: "addPeople",
  deletePeople: "deletePeople",
  sendMoney: "sendMoney",
  addQuickItem: "addQuickItem",
  resetList: "resetList",
};

module.exports.colors = {
  fallbackColors: {
    low: "#e8faff",
    blod: "#2cc8f7",
  },
  landingPageColors: {
    low: "#eaf6e4",
    bold: "#7b9370",
  },
  todoColors: {
    low: "#F3F4F6",
    bold: "#9CA3AF",
  },
  shoppingColors: {
    low: "#E1F2F6",
    bold: "#007CAD",
  },
  quickListColors: {
    low: "#E1F2F6",
    bold: "#1F2937",
  },
};

module.exports.newListFormHelperText = {
  shopping: "(e.g. Christmas Shopping List, Kate's Birthday)",
  grocery: "(e.g. Walmart List, Thanksgiving Party, Dinner Recipe)",
  todo: "(e.g. Home Remodel Project 🏠, Work to-do List)",
};

module.exports.radioGroupHelperTextObject = {
  private: "PRIVATE",
  public: "PUBLIC",
  restricted: "RESTRICTED",
};

module.exports.dialogueObject = {
  addItem: {
    header: "Add Item",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Enter item name",
        helperText: "Name your grocery list item",
      },
    ],
    button: [
      {
        textColor: "black",
        color: "#fed59a",
        text: "Add Item",
        icon: "addIcon",
      },
    ],
  },
  editItem: {
    header: "Edit Item",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Rename item",
        helperText: "Enter a different name for your item",
      },
    ],
    button: [
      {
        defaultValue: true,
        textColor: "black",
        color: "#fed59a",
        text: "Edit Now",
        icon: "editIcon",
      },
    ],
  },
  deleteItem: {
    header: "Delete Item",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "",
        helperText: "Are you sure you want to delete this item?",
      },
    ],
    button: [
      {
        textColor: "black",
        color: "red",
        text: "Delete item",
        icon: "deleteIcon",
      },
    ],
  },
  deleteList: {
    header: "Are You Sure?",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Verify the name of the list",
        helperText: "You agree to delete the list",
      },
    ],
    button: [
      {
        textColor: "black",
        color: "red",
        text: "Delete Entire List",
        icon: "deleteIcon",
      },
    ],
  },
  editList: {
    header: "Edit List",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Enter the new name",
        helperText: null,
      },
    ],
    button: [
      {
        textColor: "black",
        color: "#fed59a",
        text: "Edit Now",
        icon: "editIcon",
      },
    ],
  },
  addQuickItem: {
    header: "Add Item",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Enter item name",
        helperText: "Name your list item",
      },
    ],
    button: [
      {
        textColor: "white",
        color: "#1F2937",
        text: "Add Item",
        icon: "addIcon",
      },
    ],
  },
  sendMoney: {
    header: "Send/Request",
    textFields: [
      {
        defaultValue: false,
        hidden: true,
        text: "",
        helperText: "",
      },
    ],
    button: [
      {
        textColor: "#1F2937",
        color: "#f5f5f7",
        text: "Apple Wallet",
        icon: "appleIcon",
      },
      {
        textColor: "white",
        color: "#378fe9",
        text: "Open Venmo",
        icon: "venmoIcon",
      },
      {
        textColor: "white",
        color: "#3fb950",
        text: "Open Cash App",
        icon: "cashappIcon",
      },
    ],
  },
  deletePeople: {
    header: "Remove People",
    textFields: [],
    button: [
      {
        textColor: "#1F2937",
        color: "red",
        text: "Delete Checked",
        icon: "deletePeople",
      },
    ],
  },
  resetList: {
    header: "Reset List",
    textFields: [
      {
        defaultValue: true,
        hidden: false,
        text: "Verify the name of the list",
        helperText: "You agree to reset the list",
      },
    ],
    button: [
      {
        textColor: "black",
        color: "red",
        text: "Reset All Items",
        icon: "deleteIcon",
      },
    ],
  },
};

// Engines
const engine = "https://katespracticespace.com";
// const engine = "http://joses-macbook-pro-3.local:8080";

module.exports.URLS = {
  // Authentication endpoins
  registerUri: `${engine}/api/v1/auth/register`,
  loginUri: `${engine}/api/v1/auth/authenticate`,
  logout: `${engine}/api/v1/auth/logout`,
  getUserInfo: `${engine}/api/v1/auth/get-user-info`,

  // Authorized endpoints
  getListsUri: `${engine}/server/get-lists`,
  createListUri: `${engine}/server/create-list`,
  createContainerUri: `${engine}/server/create-container`,
  checkSession: `${engine}/api/v1/auth/check-login-status`,
  deleteList: `${engine}/server/delete-list`,
  updateListNameUri: `${engine}/server/update-list`,
  getListUri: `${engine}/server/get-list`,
  createListItemUri: `${engine}/server/create-list-item`,
  updateListItemUri: `${engine}/server/update-list-item`,
  checkListItemUri: `${engine}/server/check-list-items`,
  deleteItem: `${engine}/server/delete-list-item`,
  addPeople: `${engine}/server/add-people`,
  removePeople: `${engine}/server/remove-people-from-list`,
  lookupUser: `${engine}/server/lookup-user`,
  getPeopleFromList: `${engine}/server/get-people-from-list`,
  resetList: `${engine}/server/reset-list`,
  getSuggestedPeople: `${engine}/server/fetch-suggested-people`,
  resetList: `${engine}/server/reset-list`,
  // Public endpoints
  createPublicListItemUri: `${engine}/public/shared/create-list-item`,
  getPublicListUri: `${engine}/public/shared/get-list`,
  updatePublicListItemUri: `${engine}/public/shared/update-list-item`,
  checkPublicListItemUri: `${engine}/public/shared/check-list-items`,
  deletePublicItem: `${engine}/public/shared/delete-list-item`,
  resetPublicList: `${engine}/server/reset-list`,
};

// Generalized messages here
module.exports.messages = {
  unauthorizedAction:
    "Hmmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities.",
  unauthorizedAccess:
    "Hmmm... It seems like you don't have access to this link. Please make sure that you are accessing a list in which you are added.",
  genericError: "Apologies. Something went wrong on our end.",
  noList: "Whoops! This link is no longer active.",
};

// Enum to display cards in landing page
module.exports.filterCardsBy = {
  all: 0,
  public: 1,
  private: 2,
  restricted: 3,
};
