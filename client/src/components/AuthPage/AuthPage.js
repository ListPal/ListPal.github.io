import { useEffect } from "react";
import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { checkSession } from "../../utils/rest";
import { colors } from "../../utils/enum";
import "./AuthPageStyle/AuthPage.scss";

const AuthPage = ({ setUser, user, theme }) => {
  const navigate = useNavigate();

  const handleCheckSession = async () => {
    // Check if user is logged in already and redirect if so
    const res = await checkSession();
    if (res.status === 200) {
      setUser(res?.user);
      setTimeout(() => navigate(`/containers`), 1000);
    } else {
      setTimeout(() => navigate(`/login`), 1000);
    }
  };

  useEffect(() => {
    handleCheckSession();
  }, []);

  return (
    <div>
      <meta name="theme-color" content={colors[theme]?.generalColors.outerBackground} />
      <BlurOnOutlinedIcon
        className="rotation-element"
        sx={{ mt: "calc(50vh - 50%)", width: 200, height: 200, color: colors[theme]?.generalColors.fontColor }}
      />
      <Typography color={colors[theme]?.generalColors.fontColor} fontFamily={"Urbanist"}>Checking Authentication...</Typography>
    </div>
  );
};

export default AuthPage;
