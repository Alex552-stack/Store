import { ThemeProvider } from "@emotion/react";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { fetchCurrentUser } from "../../features/account/accountSlice";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import HomePage from "../../features/home/HomePage";
import { useAppDispatch } from "../store/configureStore";
import Header from "./Header";
import LoadinComponent from "./LoadingComponent";


function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error: any) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false))
  }, [initApp])

  const [darkMode, setDarkMode] = useState(false);
  const palletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: palletteType,
      background: {
        default: palletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })
  function SwitchDarkMode() {
    setDarkMode(!darkMode);
  }


  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header switchDarkMode={SwitchDarkMode} />
      {loading ? <LoadinComponent message="Loading..." />
          : location.pathname === '/' ? <HomePage />
          : <Container sx = {{mt: 4}}>
              <Outlet />
           </Container>
      }

    </ThemeProvider>
  );
}

export default App;


