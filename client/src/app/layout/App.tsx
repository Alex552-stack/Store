import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, Switch, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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
      <ToastContainer position="bottom-right" hideProgressBar theme = "colored"/>
      <CssBaseline />
      <Header switchDarkMode={SwitchDarkMode}/>
      <Container>
        <Outlet/>
      </Container>

    </ThemeProvider>
  );
}

export default App;


