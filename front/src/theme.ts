import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    allVariants: {
      color: "#212121",
    },
  h4: {
    fontFamily: '"Barrio", system-ui',
    fontWeight: 400,
    fontStyle: 'normal'
  },
  },
  palette: {
    primary: {
      main: "#0c5977ff", // azul padrão MUI
    },
    secondary: {
      main: "#73232bff", // roxo padrão MUI
    },
    text: {
      primary: "#212121",
    },
    background: {
      default: "#c6c6c6ff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url("img/bg.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "100%",
        },
      },
    },
  },
});

export default theme;
