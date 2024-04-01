import React from 'react'
import TerminalsSearch from '../Components/TerminalsSearch'
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material'
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import appState from '../store/appState';
import { useNavigate } from 'react-router-dom';

const Main = observer(() => {

  const [store] = useState(appState);
  const navigator = useNavigate();

  const setCity = (val) => {
    store.changeSearchVal(val);
    store.changeIata(val.iata);
  }

  return (
    <Grid item xs={12} sx={{ textAlign: 'center' }}>
      <TerminalsSearch />
      <p style={{ margin: 0, color: 'white' }}>
        <Typography component="span" variant="caption" sx={{
          "&:hover": {
            color: 'gray',
            borderBottom: '1px dotted gray'
          },
          borderBottom: '1px dotted white',
          cursor: 'pointer'
        }} onClick={() => setCity({label: "Москва, Россия", name: "Москва", countryCode: "ru", iata: "MOW"})}>
          Москва
        </Typography>,&nbsp;
        <Typography component="span" variant="caption" sx={{
          "&:hover": {
            color: 'gray',
            borderBottom: '1px dotted gray'
          },
          borderBottom: '1px dotted white',
          cursor: 'pointer'
        }} onClick={() => setCity({label: "Санкт-Петербург, Россия", name: "Санкт-Петербург", countryCode: "ru", iata: "LED"})}>
          Санкт-Петербург
        </Typography>,&nbsp;
        <Typography component="span" variant="caption" sx={{
          "&:hover": {
            color: 'gray',
            borderBottom: '1px dotted gray'
          },
          borderBottom: '1px dotted white',
          cursor: 'pointer'
        }} onClick={() => setCity({label: "Франкфурт, США", name: "Франкфурт", countryCode: "us", iata: "FFT"})}>
          Франкфурт
        </Typography>
      </p>
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled button group"
        >
          <Button startIcon={<FlightTakeoffIcon />} sx={store.directionVal === "departure" ? {} : {
            backgroundColor: 'white',
            color: 'black'
          }} onClick={() => store.changeDirection('departure')}>Вылет</Button>
          <Button startIcon={<FlightLandIcon />} sx={store.directionVal === "arrival" ? {} : {
            backgroundColor: 'white',
            color: 'black'
          }} onClick={() => store.changeDirection('arrival')}>Прилет</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ textAlign: 'center', px: 2, pb: 2 }}>
        <Button
          variant='contained'
          sx={{ "&.Mui-disabled": { backgroundColor: 'primary.main', color: 'white' } }}
          onClick={() => navigator(`/booking?iata=${store.iataVal}&direction=${store.directionVal}`)}
          disabled={!store.directionVal || !store.iataVal ? true : false}
        >Заказать</Button>
      </Box>
    </Grid>
  )
});
export default Main;