import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { Route, Routes, HashRouter } from "react-router-dom";
import GroceryListPage from "./components/GroceryListPage/GroceryListPage";
import { useState } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import QuickList from "./components/QuickList/QuickList";
import Containers from "./components/Containers/Containers";
import AddPeopleList from "./components/AddPeopleList/AddPeopleList";
// IMGS
import groceryWallpaper from "./assets/groceryWallpaperPlus.jpg";
import todoWallpaper from "./assets/todoWallpaperPlus.jpg";
import shoppingWallpaper from "./assets/shoppingWallpaperPlus.jpg";
import groceryStrip from "./assets/groceryStrip.jpg";
import todoStrip from "./assets/todoStrip.jpg";
import shoppingStrip from "./assets/shoppingStrip.jpg";
import grocery from "./assets/grocery.jpg";
import shop from "./assets/shop.jpg";
import todo from "./assets/todo.jpg";

function App() {
  const [activeList, setActiveList] = useState({ groceryListItems: [] });
  const [activeContainer, setActiveContainer] = useState({
    collapsedLists: [],
  });
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/containers"
            element={
              <Containers
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
            path="/"
            element={
              <Login
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
                groceryStrip={groceryStrip}
                todoStrip={todoStrip}
                shoppingStrip={shoppingStrip}
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
                groceryWallpaper={groceryWallpaper}
                todoWallpaper={todoWallpaper}
                shoppingWallpaper={shoppingWallpaper}
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
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
              />
            }
          />
          <Route path="/quick-list" element={<QuickList />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
