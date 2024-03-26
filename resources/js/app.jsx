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

const newTheme = createTheme({
  palette: {
    primary: {
      main: '#3483fa',
    }
  },
  typography: {
    fontFamily: [
      "FuturaPTDemi",
      'sans-serif'
    ].join(','),
    body1: {
      fontFamily: 'Helvetica, sans-serif',
      letterSpacing: '0.5px'
    },
    body2: {
      fontFamily: 'Helvetica, sans-serif',
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
        <Grid item xs={12} sx={{
            p: 2,
            textAlign: 'center'
        }}>
            <img src="/assets/images/logo.svg" alt="Logo" style={{ width: '100%', maxWidth: 220 }} />
        </Grid>
        <Grid item xs={12}>
          <Routes>
            <Route path='/' element={<Main />} />
            {/* <Route path='/privacy-policy' element={<Privacy />} />
            <Route path="*" element={<Error404 />} /> */}
          </Routes>
        </Grid>
      </Grid>
      <Footer />
      {/* <Notification /> */}
      {/* <ToTopBtn /> */}
    </ThemeProvider>
  </BrowserRouter>
);