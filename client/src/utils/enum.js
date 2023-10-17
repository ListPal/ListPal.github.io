const DARK_OUTER = "#2D2D2D";
const DARK_INNER = "#414141";
const DARK_TEXT = "#CECECE";
const DARK_BOLD = "#9F9F9F";

const LIGHT_TEXT = "#3D4F58";

const mobileWidth = "480px";

// Enum to display cards in landing page
const filterCardsBy = {
  all: 0,
  public: 1,
  private: 2,
  restricted: 3,
};

// Normalized messages here
const messages = {
  genericError: "Apologies. Something went wrong.",
  noList: "Whoops! This link is no longer active.",
  unauthorizedAction:
    "Hmmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities.",
  unauthorizedAccess:
    "Hmmm... It seems like you don't have access to this link. Please make sure that you are accessing a list in which you are added.",
};

const groceryContainerTypes = {
  todo: "TODO",
  whishlist: "WISHLIST",
  grocery: "GROCERY",
};

const groceryListScopes = {
  public: "PUBLIC",
  private: "PRIVATE",
  restricted: "RESTRICTED",
};

const newListFormHelperText = {
  shopping: "Good list names are short (e.g. Kate's Birthday, Shared Christmas List)",
  grocery: "Good list names are short (e.g. Walmart List, Thanksgiving Party, Dinner Recipe)",
  todo: "Good list names are short (e.g.  Work to-do List, Home Remodel Project 🏠)",
};

const borderColors = [
  "black",
  "#F0B323",
  "#30C8C9",
  "#CC801F",
  "#7b9370",
  "#13707e",
  "#ff9466",
  "#133857",
  "#42062a",
  "#aff5b4",
  "#FF6969",
];

const themes = {
  darkTheme: "darkTheme",
  lightTheme: "lightTheme",
};

const colors = {
  darkTheme: {
    generalColors: {
      userTopMenu: DARK_INNER,
      fontColor: DARK_TEXT,
      helperTextFontColor: DARK_TEXT,
      outerBackground: DARK_OUTER,
      innerBackground: DARK_INNER,
      slideSelector: {
        active: "lightgray",
        inactive: "black",
      },
    },
    fallbackColors: {
      low: DARK_INNER,
      medium: DARK_INNER,
      bold: DARK_BOLD,
    },
    landingPageColors: {
      low: DARK_INNER,
      medium: DARK_INNER,
      bold: DARK_BOLD,
    },
    todoColors: {
      low: DARK_INNER,
      medium: DARK_INNER,
      bold: DARK_BOLD,
    },
    shoppingColors: {
      low: DARK_INNER,
      medium: DARK_INNER,
      bold: DARK_BOLD,
    },
    quickListColors: {
      low: DARK_INNER,
      medium: DARK_INNER,
      bold: DARK_BOLD,
    },
  },

  lightTheme: {
    generalColors: {
      userTopMenu: "black",
      fontColor: LIGHT_TEXT,
      helperTextFontColor: "rgba(0, 0, 0, 0.6)",
      outerBackground: "white",
      innerBackground: "white",
      slideSelector: {
        active: "black",
        inactive: "lightgray",
      },
    },
    fallbackColors: {
      low: "#e8faff",
      medium: "#b9efff",
      bold: "black",
    },
    landingPageColors: {
      low: "#eaf6e4",
      medium: "#FFF5EB",
      bold: "#7b9370",
    },
    todoColors: {
      low: "#F3F4F6",
      medium: "#F3F4F6",
      bold: "#9CA3AF",
    },
    shoppingColors: {
      low: "#E1F2F6",
      medium: "#ffff",
      bold: "#007CAD",
    },
    quickListColors: {
      low: "#E1F2F6",
      medium: "#b9efff",
      bold: "black",
    },
  },
};

const dialogues = {
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

const dialogueObject = {
  addItem: {
    header: "Add Item",
    textFields: [
      {
        maxLength: 100,
        defaultValue: true,
        hidden: false,
        text: "Enter item name",
        helperText: "Name your list item",
        required: true,
      },
    ],
    button: [
      {
        textColor: {
          lightTheme: LIGHT_TEXT,
          darkTheme: DARK_TEXT,
        },
        color: {
          lightTheme: "#fed59a",
          darkTheme: DARK_OUTER,
        },
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
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "#fed59a", darkTheme: DARK_OUTER },
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
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "red", darkTheme: DARK_OUTER },
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
        textColor: { lightTheme: 'black', darkTheme: DARK_TEXT },
        color: { lightTheme: "red", darkTheme: DARK_OUTER },
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
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "#fed59a", darkTheme: DARK_OUTER },
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
        color: "black",
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
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "#f5f5f7", darkTheme: DARK_OUTER },
        text: "Apple Wallet",
        icon: "appleIcon",
      },
      {
        textColor: { lightTheme: "white", darkTheme: DARK_TEXT },
        color: { lightTheme: "#378fe9", darkTheme: DARK_OUTER },
        text: "Open Venmo",
        icon: "venmoIcon",
      },
      {
        textColor: { lightTheme: "white", darkTheme: DARK_TEXT },
        color: { lightTheme: "#3fb950", darkTheme: DARK_OUTER },
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
        textColor: { lightTheme: 'black', darkTheme: DARK_TEXT },
        color: { lightTheme: "red", darkTheme: DARK_OUTER },
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
        helperText: "Erase items permanently, preserving the list",
      },
    ],
    button: [
      {
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "#fed59a", darkTheme: DARK_OUTER },
        text: "Erase All Items",
        icon: "deleteIcon",
      },
      {
        textColor: { lightTheme: LIGHT_TEXT, darkTheme: DARK_TEXT },
        color: { lightTheme: "#fed59a", darkTheme: DARK_OUTER },
        text: "Erase Checked",
        icon: "removeDoneIcon",
      },
    ],
  },
};

// Engines
// const engine = "https://katespracticespace.com";
const engine = "http://joses-macbook-pro-3.local:8080";

const URLS = {
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
  checkListItemsUri: `${engine}/server/check-list-items`,
  deleteItem: `${engine}/server/delete-list-item`,
  addPeople: `${engine}/server/add-people`,
  removePeople: `${engine}/server/remove-people-from-list`,
  lookupUser: `${engine}/server/lookup-user`,
  getPeopleFromList: `${engine}/server/get-people-from-list`,
  getSuggestedPeople: `${engine}/server/fetch-suggested-people`,
  resetList: `${engine}/server/reset-list`,
  eraseListItems: `${engine}/server/delete-list-items`,
  updateEmail: `${engine}/server/update-email`,
  updateName: `${engine}/server/update-name`,
  updatePhone: `${engine}/server/update-phone`,
  updatePassword: `${engine}/server/update-password`,
  updateUserPreferences: `${engine}/server/update-user-preferences`,

  // Public endpoints
  createPublicListItemUri: `${engine}/public/shared/create-list-item`,
  getPublicListUri: `${engine}/public/shared/get-list`,
  updatePublicListItemUri: `${engine}/public/shared/update-list-item`,
  checkPublicListItemsUri: `${engine}/public/shared/check-list-items`,
  deletePublicItem: `${engine}/public/shared/delete-list-item`,
  resetPublicList: `${engine}/server/reset-list`,
  updateListOrder: `${engine}/server/updated-list-order`,
  refactorCollapsedLists: `${engine}/server/update-collapsed-list-order`,
};

export {
  messages,
  filterCardsBy,
  URLS,
  mobileWidth,
  groceryContainerTypes,
  groceryListScopes,
  borderColors,
  dialogues,
  colors,
  newListFormHelperText,
  dialogueObject,
  themes,
};
