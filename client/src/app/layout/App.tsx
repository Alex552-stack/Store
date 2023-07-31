import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../api/agent";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import Header from "./Header";
import LoadinComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";


function App() {
  const dispatch = useAppDispatch();
  const[loading, setLoading] = useState(true);

useEffect(() => {
  const buyerId = getCookie('buyerId');
  if(buyerId){
    agent.Basket.get() 
      .then(basket => dispatch(setBasket(basket)))
      .catch(error => console.log(error))
      .finally(() => setLoading(false))
  } else{
    setLoading(false);
  }
}, [dispatch])

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


