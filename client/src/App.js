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

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [wasDragged, setWasDragged] = useState(false);
  const [wasChecked, setWasChecked] = useState(false);
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
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                user={user}
                setUser={setUser}
                activeList={activeList}
                setActiveList={setActiveList}
                wasChecked={wasChecked}
                setWasChecked={setWasChecked}
                wasDragged={wasDragged}
                setWasDragged={setWasDragged}
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
