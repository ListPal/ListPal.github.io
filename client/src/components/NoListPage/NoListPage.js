import { Button, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { colors } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
const NoListPage = ({ theme }) => {
  const navigate = useNavigate();
  return (
    <>
      <svg
        viewBox="0 0 1024 1024"
        className="icon"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M732.2 362.9C534.7 319.6 696.6 45.7 426 68.4s-527.2 645.8-46.8 791.7 728-414.9 353-497.2z"
            fill="#464BD8"
          ></path>
          <path
            d="M413.9 697.7l90.1-90.1c9-9 14-21 14-33.7 0-11.4-4-22.1-11.3-30.8l29.3-29.3c32 25.6 71.5 39.6 113.1 39.6 48.5 0 94.1-18.9 128.3-53.1 34.3-34.3 53.1-79.8 53.1-128.3 0-48.5-18.9-94.1-53.1-128.3-34.3-34.3-79.8-53.1-128.3-53.1-48.5 0-94.1 18.9-128.3 53.1-34.3 34.3-53.1 79.8-53.1 128.3 0 41.6 13.9 81.1 39.6 113.1L478 514.4c-8.6-7.3-19.4-11.3-30.8-11.3-12.7 0-24.7 5-33.7 14L323.3 607c-9 9-14 21-14 33.7 0 12.7 5 24.7 14 33.7l23.2 23.2c9 9 21 14 33.7 14 12.8 0 24.8-5 33.7-13.9z"
            fill="#2D2D40"
          ></path>
          <path
            d="M539 261.6c29.4-29.4 68.5-45.7 110.2-45.7 41.6 0 80.7 16.2 110.2 45.7C788.8 291 805 330.1 805 371.8c0 41.6-16.2 80.7-45.7 110.2-29.4 29.4-68.5 45.7-110.2 45.7-41.6 0-80.7-16.2-110.2-45.7-29.4-29.4-45.7-68.5-45.7-110.2 0.2-41.7 16.4-80.8 45.8-110.2z"
            fill="#FFFFFF"
          ></path>
          <path
            d="M673.3 263c-37.6 0-72.9 14.6-99.5 41.2-26.6 26.6-41.2 61.9-41.2 99.5 0 24.5 6.2 48 17.9 68.8 26.5 26.2 61.6 40.6 98.9 40.6 37.6 0 72.9-14.6 99.5-41.2 26.6-26.6 41.2-61.9 41.2-99.5 0-24.5-6.2-48-17.9-68.8-26.6-26.2-61.6-40.6-98.9-40.6z"
            fill="#dbfff8"
          ></path>
          <path
            d="M375.4 686.8l-45-44a8.04 8.04 0 0 1-2.4-5.7c0-1.2 0.3-3.7 2.4-5.7L436.8 525c2.1-2.1 4.5-2.4 5.7-2.4s3.7 0.3 5.7 2.4l45 44c2.1 2.1 2.4 4.5 2.4 5.7 0 1.2-0.3 3.7-2.4 5.7L386.8 686.8a8.04 8.04 0 0 1-5.7 2.4c-1.3 0-3.7-0.3-5.7-2.4z"
            fill="#FFFFFF"
          ></path>
          <path
            d="M440.4 541.3c-1.2 0-3.6 0.3-5.7 2.4L338.3 640l37 36c2 2.1 4.4 2.4 5.7 2.4 1.2 0 3.6-0.3 5.7-2.4l96.3-96.3-37-36c-1.9-2.1-4.4-2.4-5.6-2.4z"
            fill="#464BD8"
          ></path>
        </g>
      </svg>
      <Typography
        p
        fontFamily={"Urbanist"}
        variant={"h4"}
        fontWeight={100}
        color={colors[theme].generalColors.fontColor}
      >
        Hmmm... It seems that this list no longer exist.
      </Typography>
      <Stack>
        <Button onClick={() => navigate("/containers")}>
          <HomeIcon sx={{ color: colors[theme].generalColors.fontColor }} />
        </Button>
      </Stack>
    </>
  );
};

export default NoListPage;
