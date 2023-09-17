import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Avatar,
  Checkbox,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  peopleToDelete,
  setPeopleToDelete
} from "@mui/material";
import { postRequest } from "../../utils/testApi/testApi";
import { URLS } from "../../utils/enum";
import { useNavigate } from "react-router-dom";

const RemovePeople = ({
  listInfo,
  setLoading,
  peopleToDelete,
  setPeopleToDelete,
  activeContainer,
}) => {
  const [currentPeople, setCurrentPeople] = useState([]);
  const navigate = useNavigate();

  // Handlers
  const handleToggleListItem = (value) => () => {
    const currentIndex = peopleToDelete.indexOf(value);
    const newChecked = [...peopleToDelete];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setPeopleToDelete(newChecked);
  };


  const handleFetchCurrentPeople = async () => {
    const data = {
      containerId: listInfo?.reference,
      listId: listInfo?.id,
    };
    setLoading(true)
    const res = await postRequest(URLS.getPeopleFromList, data);
    if (res?.status === 200) {
      const people = res?.body.filter(username => username !== activeContainer?.username)
      setCurrentPeople(people)
    } else if (res?.status === 201) {
      console.log(res);
    } else if (res?.status === 401) {
      console.log(res);
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/login");
    } else {
      console.log(res);
    }
    setLoading(false)
  };

  useEffect(() => {handleFetchCurrentPeople()}, []);

  return (
    <List
      dense
      sx={{
        bgcolor: "background.paper",
        overflow: "scroll",
        maxHeight: "40vh",
      }}
    >
      {currentPeople.map((user, i) => {
        const labelId = `checkbox-list-secondary-label-${user}`;
        return (
          <ListItem
            key={i + "list-item"}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggleListItem(user)}
                checked={peopleToDelete.indexOf(user) !== -1}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`${user}`}
                  src={`/static/images/avatar/${user}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText
                id={labelId}
                primary={`${user.split("@")[0]}`}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default RemovePeople;
