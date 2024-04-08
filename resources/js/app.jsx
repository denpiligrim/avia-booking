// import './bootstrap';
import style from '../sass/app.scss?inline'

import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline, Grid, ThemeProvider, createTheme } from '@mui/material';
import Main from './Pages/Main';
import Error404 from './Pages/Error404';
import Header from './Components/Header';
import Footer from './Components/Footer';
// import Notification from './Components/Notification';
// import ScrollToTop from './Components/ScrollToTop';
// import ToTopBtn from './Components/ToTopBtn';
import Privacy from './Pages/Privacy';
import Booking from './Pages/Booking';
import Checkout from './Pages/Checkout';

const newTheme = createTheme({
  palette: {
    primary: {
      main: '#3483fa',
    }
  },
  typography: {
    fontFamily: [
      "Montserrat",
      'sans-serif'
    ].join(','),
    body1: {
      fontFamily: 'Montserrat, sans-serif',
      letterSpacing: '0.5px'
    },
    body2: {
      fontFamily: 'Montserrat, sans-serif',
      letterSpacing: '0.5px'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: style,
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: '#3483fa'
          },
          "& input::placeholder": {
            verticalAlign: 'middle'
          }
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    {/* <ScrollToTop /> */}
    <ThemeProvider theme={newTheme}>
      <CssBaseline />
      <Header />
      <Grid container justifyContent={'center'} alignItems={'center'}>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/booking/checkout' element={<Checkout />} />
          {/* <Route path='/privacy-policy' element={<Privacy />} />
            <Route path="*" element={<Error404 />} /> */}
        </Routes>
      </Grid>
      <Footer />
      {/* <Notification /> */}
      {/* <ToTopBtn /> */}
    </ThemeProvider>
  </BrowserRouter>
);