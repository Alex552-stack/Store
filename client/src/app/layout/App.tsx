import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, Switch, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { useState } from "react";



function App() {
  const [darkMode, setDarkMode] = useState(false);
  const palletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette:{
      mode: palletteType,
      background:{
        default:palletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })
  function SwitchDarkMode(){
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header switchDarkMode={SwitchDarkMode}/>
      <Container>
        <Catalog/>
      </Container>

    </ThemeProvider>
  );
}

export default App;


