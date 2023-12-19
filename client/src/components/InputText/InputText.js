import React from "react";
import { colors } from "../../utils/enum";

const InputText = ({ _ref, theme, maxLength, placeholder }) => {
  return (
    <>
      <input
        ref={_ref}
        id="new-item-input"
        placeholder={placeholder}
        style={{
          borderRadius: 0,
          padding: "1rem",
          fontFamily: "Urbanist",
          fontSize: "1rem",
          color: colors[theme]?.generalColors.fontColor,
          border: `1px solid ${colors[theme]?.generalColors.lightBorder}`,
          background: "none",
          maxLength: { maxLength },
          outline: "none",
        }}
      />
    </>
  );
};

export default InputText;
