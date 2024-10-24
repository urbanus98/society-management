import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import theme from "./Theme";

// Component that uses TextField components within the dark-themed environment
export default function AdvTextField() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        {/* Customize TextField components */}
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        {/* <TextField id="filled-basic" label="Filled" variant="filled" />
        <TextField id="standard-basic" label="Standard" variant="standard" /> */}
      </Box>
    </ThemeProvider>
  );
}
