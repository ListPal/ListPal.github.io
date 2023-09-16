module.exports.mobileWidth = "480px";

module.exports.PUBLIC_CODE = "leknlkenwknlknklwncfc1edi7e2y97ry48032ujdede";

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
  sendMoney: "sendMoney",
  addQuickItem: "addQuickItem",
};

module.exports.colors = {
  landingPageColors: {
    low: "#eaf6e4",
    midLow: "#d7ebce",
    mid: "#bdd7b0",
    bold: "#7b9370",
    banana: "#f8e3a1",
  },
  todoColors: {
    low: "#F3F4F6",
    bold: "#9CA3AF",
  },
  shoppingColors: {
    low: "#E1F2F6",
    bold: "#007CAD",
  },
};

module.exports.newListFormHelperText = {
  shopping: "(e.g. Christmas Shopping List, Kate's Birthday)",
  grocery: "(e.g. Walmart List, Kate's Birthday, Dinner Recipe)",
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
  addPeople: {
    header: "Add People to List",
    textFields: [
      {
        defaultValue: false,
        hidden: true,
        text: "username, phone number",
        helperText: "Lookup user by username or phone number",
      },
    ],
    button: [
      {
        textColor: "#1F2937",
        color: "#fed59a",
        text: "Lookup By Username",
        icon: 'lookup',
      },
      {
        textColor: "#1F2937",
        color: "#fed59a",
        text: "Lookup By Phone ",
        icon: 'phone',
      },
    ],
  },
};

// Engines
// const engine = "https://katespracticespace.com";
const engine = "http://joses-macbook-pro-3.local:8080";

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
  lookupUser: `${engine}/server/lookup-user`,

  // Public endpoints
  createPublicListItemUri: `${engine}/public/shared/create-list-item`,
  getPublicListUri: `${engine}/public/shared/get-list`,
  updatePublicListItemUri: `${engine}/public/shared/update-list-item`,
  checkPublicListItemUri: `${engine}/public/shared/check-list-items`,
  deletePublicItem: `${engine}/public/shared/delete-list-item`,
};

module.exports.messages = {
  unauthorizedAction:
    "Hmmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities.",
  unauthorizedAccess:
    "Hmmm... It seems like you don't have access to this link. Please make sure that you are accessing a list in which you are added.",
};

module.exports.filterCardsBy = {
  all: 0,
  public: 1,
  private: 2,
  restricted: 3,
};
