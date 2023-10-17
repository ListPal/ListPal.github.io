import "./App.css";
import { useState } from "react";
import { Route, Routes, HashRouter } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import GroceryListPage from "./components/GroceryListPage/GroceryListPage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import QuickList from "./components/QuickList/QuickList";
import Containers from "./components/Containers/Containers";
import AddPeopleList from "./components/AddPeopleList/AddPeopleList";
// IMGS
import grocery from "./assets/grocery.jpg";
import shop from "./assets/shop.jpg";
import todo from "./assets/todo.jpg";
//
import Profile from "./components/Profile/Profile";
import ChangeEmail from "./components/ChangeEmail/ChangeEmail";
import ChangeName from "./components/ChangeName/ChangeName";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import ChangePhone from "./components/ChangePhone/ChangePhone";
import AuthPage from "./components/AuthPage/AuthPage";

import { themes } from "./utils/enum";

function App() {
  const [theme, setTheme] = useState(themes.lightTheme);
  const [user, setUser] = useState(null);
  const [activeList, setActiveList] = useState({ groceryListItems: [] });
  const [activeContainer, setActiveContainer] = useState({
    collapsedLists: [],
  });

  return (
    <div className={user?.userPreferences?.theme || theme}>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <AuthPage
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
              />
            }
          />
          <Route
            path="/containers"
            element={
              <Containers
                theme={user?.userPreferences?.theme || theme}
                grocery={grocery}
                todo={todo}
                shop={shop}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                theme={user?.userPreferences?.theme || theme}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
              />
            }
          />
          <Route
            path="/container"
            element={
              <LandingPage
                theme={user?.userPreferences?.theme || theme}
                grocery={grocery}
                todo={todo}
                shop={shop}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
              />
            }
          />
          <Route
            path="/list"
            element={
              <GroceryListPage
                theme={user?.userPreferences?.theme || theme}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
              />
            }
          />
          <Route
            path="/addPeople"
            element={
              <AddPeopleList
                theme={user?.userPreferences?.theme || theme}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                setTheme={setTheme}
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/profile/change-name"
            element={
              <ChangeName
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/profile/change-email"
            element={
              <ChangeEmail
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/profile/change-phone"
            element={
              <ChangePhone
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/profile/change-password"
            element={
              <ChangePassword
                theme={user?.userPreferences?.theme || theme}
                user={user}
                setUser={setUser}
              />
            }
          />

          <Route
            path="/quick-list"
            element={<QuickList theme={user?.userPreferences?.theme || theme} />}
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
