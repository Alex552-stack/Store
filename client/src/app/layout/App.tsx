import Catalog from "../../features/catalog/Catalog";
import { Container, CssBaseline, Switch, createTheme } from "@mui/material";
import Header from "./Header";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadinComponent from "./LoadingComponent";


function App() {
  const{setBasket} = useStoreContext();
  const[loading, setLoading] = useState(true);

useEffect(() => {
  const buyerId = getCookie('buyerId');
  if(buyerId){
    agent.Basket.get() 
      .then(basket => setBasket(basket))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  } else{
    setLoading(false);
  }
}, [])

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

  if(loading) return <LoadinComponent message="Loading..."/>

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


