import { createTheme } from "@mui/material/styles";
// Create a custom dark theme
const theme = createTheme({
  palette: {
    mode: "dark", // Use dark mode
    primary: {
      main: "#90caf9", // Customize primary color
    },
    background: {
      default: "#121212", // Customize background color
    },
  },
});

export default theme;
