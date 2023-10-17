import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Avatar,
  Checkbox,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { postRequest } from "../../utils/rest";
import { URLS, colors } from "../../utils/enum";
import { useNavigate } from "react-router-dom";

const RemovePeople = ({
  listInfo,
  loading,
  setLoading,
  peopleToDelete,
  setPeopleToDelete,
  activeContainer,
  theme,
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
    setLoading(true);
    const res = await postRequest(URLS.getPeopleFromList, data);
    if (res?.status === 200) {
      const people = res?.body.filter((username) => username !== activeContainer?.username);
      setCurrentPeople(people);
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
    setLoading(false);
  };

  useEffect(
    () => {
      handleFetchCurrentPeople();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <List
      dense
      sx={{
        bgcolor: colors[theme]?.generalColors.innerBackground,
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
                <Avatar alt={`${user}`} src={`/static/images/avatar/${user}.jpg`} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={<Typography fontFamily={'Urbanist'} color={colors[theme]?.generalColors.fontColor}>{user.split("@")[0]}</Typography>} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default RemovePeople;
