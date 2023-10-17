import { useState } from "react";
import QuickDialogue from "./QuickDialogue/QuickDialogue";
import QuickListItem from "./QuickListItem/QuickListItem";
import { dialogueObject, dialogues } from "../../utils/enum";
import { Typography, Toolbar, Grid, AppBar, Alert, Slide } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useNavigate } from "react-router-dom";
import { colors } from "../../utils/enum";

const QuickList = ({theme}) => {
  const [itemsArray, setItemsArray] = useState([]);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <meta name="theme-color" content={'black'} />
      <AppBar
        component="nav"
        sx={{
          paddingLeft: "10px",
          width: "105vw",
          background: colors[theme].quickListColors.bold,
          alignItems: "space-between",
        }}
      >
        <Toolbar>
          <IconButton size={"medium"} onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography
            fontFamily={"Urbanist"}
            padding={1}
            variant="h5"
            sx={{ color: "white", flexGrow: 1 }}
          >
            {"Quick List"} <ElectricBoltIcon />
          </Typography>
          <IconButton
            onClick={() => {
              setOpenDialogue(dialogues.addQuickItem);
            }}
          >
            <AddIcon sx={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Slide className="alert-slide" in={true}>
        <Alert severity="warning" sx={{ marginTop: 8 }}>
          {
            "In QuickList items live on the tab. If you refresh this tab all content will be lost. To have persistent lists and unlock all our features, please create a free account."
          }
        </Alert>
      </Slide>

      <Grid
        container
        padding={2}
        spacing={2}
        sx={{
          justifyContent: "center",
          justifyItems: "center",
        }}
      >
        {itemsArray.length > 0 &&
          itemsArray.map((e, i) => (
            <QuickListItem
              theme={theme}
              itemsArray={itemsArray}
              setItemsArray={setItemsArray}
              item={e}
              key={i}
              openDialogue={openDialogue}
              setOpenDialogue={setOpenDialogue}
            />
          ))}
      </Grid>

      {openDialogue === dialogues.addQuickItem && (
        <QuickDialogue
          theme={theme}
          itemsArray={itemsArray}
          setItemsArray={setItemsArray}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
          dialogueObject={dialogueObject.addQuickItem}
        />
      )}
    </div>
  );
};

export default QuickList;
