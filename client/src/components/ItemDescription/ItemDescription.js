import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  Paper,
  Stack,
} from "@mui/material";
import { colors } from "../../utils/enum";

const ItemDescription = ({
  item,
  borderColor,
  openItemDescription,
  setOpenItemDescription,
  theme,
}) => {
  const handleClose = () => {
    setOpenItemDescription(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openItemDescription}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openItemDescription}>
        <Paper
          sx={{
            display: "flex",
            direction: "column",
            position: "absolute",
            top: "25vh",
            left: "50vw",
            transform: "translate(-50%)",
            borderRadius: 2,
            width: "85vw",
            minHeight: 60,
            padding: 2,
            borderLeft: `5px solid ${borderColor ? borderColor : colors[theme].quickListColors.bold}`,
            borderRight: `5px solid ${borderColor ? borderColor : colors[theme].quickListColors.bold}`,
          }}
        >
          <Stack>
            <Typography align="left" overflow={'auto'} width={'85vw'} fontFamily={'Urbanist'}>
              {item?.name}
            </Typography>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ItemDescription;
