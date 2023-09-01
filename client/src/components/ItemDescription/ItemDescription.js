import {
  Typography,
  Modal,
  Fade,
  Backdrop,
  Paper,
  Stack,
  //   Button,
  //   TextField,
} from "@mui/material";

const ItemDescription = ({
  borderColor,
  item,
  openItemDescription,
  setOpenItemDescription,
  setIsActive,
}) => {
  const handleClose = () => {
    setOpenItemDescription(false);
    setIsActive(false);
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
            padding: 2,
            borderLeft: `5px solid ${borderColor ? borderColor : "#1F2937"}`,
            borderRight: `5px solid ${borderColor ? borderColor : "#1F2937"}`,
          }}
        >
          <Stack>
            <Typography align="left" variant="button">
              {item?.name}
            </Typography>
          </Stack>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ItemDescription;
