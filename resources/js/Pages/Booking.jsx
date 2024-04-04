import { Box, Button, ButtonGroup, Card, CardContent, CardMedia, Checkbox, Grid, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TerminalsSearch from '../Components/TerminalsSearch';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import ManIcon from '@mui/icons-material/Man';
import { observer } from 'mobx-react-lite';
import appState from '../store/appState';
import ServiceDescription from '../Components/ServiceDescription';

const Booking = observer(() => {

  const [store] = useState(appState);

  const [progress, setProgress] = useState(true);

  const [services, setServices] = useState([]);
  const [queryParameters, setQueryParameters] = useSearchParams();
  const [open, setOpen] = useState(false);  
  const [serviceInfo, setServiceInfo] = useState({});  

  const handleClickOpen = (el) => {
    setServiceInfo(el);
    setOpen(true);
  };

  const setCity = (val) => {
    store.changeSearchVal(val);
    store.changeIata(val.iata);
  }

  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    const index = services.indexOf(value);
    let arrCopy = [...services];

    if (currentIndex === -1) {
      newChecked.push(value);
      arrCopy[index][2] = true;
    } else {
      newChecked.splice(currentIndex, 1);
      arrCopy[index][2] = false;
    }
    
    setServices([...arrCopy]);
    setChecked(newChecked);
  };

  const changeCheckbox = (p) => {
    const arrCopy = [...services];    

    if (p) {
      arrCopy.forEach(el => {
        el[2] = true;
      });
      setChecked([...arrCopy]);
    } else {
      setChecked([]);
      arrCopy.forEach(el => {
        el[2] = false;
      });
    }
    setServices([...arrCopy]);

  }

  useEffect(() => {
    setProgress(true);
    if (store.iataVal && store.directionVal) {
      setQueryParameters({ iata: store.iataVal, direction: store.directionVal });
    } else {
      store.changeIata(queryParameters.get('iata') || null);
      store.changeDirection(queryParameters.get('direction') || null);
    }
    let iata = store.iataVal || queryParameters.get('iata');
    let direction = store.directionVal || queryParameters.get('direction');
    axios.get(`/api/services?iata=${iata}&direction=${direction}`)
      .then(function (res) {
        if (res.data.status) {
          const data = res.data.result;
          if (Array.isArray(data)) {
            setServices(data);
          } else {
            let groupedObjects = data.result.reduce((acc, obj) => {
              acc[obj.name] = acc[obj.name] || [];
              acc[obj.name].push(obj);
              return acc;
            }, {});
            if (!store.searchVal) {
              store.changeSearchVal(data.result[0]?.terminal?.airport?.city || null);
            }
            const entries = Object.entries(groupedObjects);
            entries.forEach((el) => {
              el.push(true)
            });
            setServices(entries);
            setChecked(entries);
          }
          setProgress(false);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [store.iataVal, store.directionVal])

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12} md={4} textAlign={'center'}>
          <TerminalsSearch />
          <p style={{ margin: 0, color: 'white' }}>
            <Typography component="span" variant="caption" sx={{
              "&:hover": {
                color: 'gray',
                borderBottom: '1px dotted gray'
              },
              borderBottom: '1px dotted white',
              cursor: 'pointer'
            }} onClick={() => setCity({ label: "Москва, Россия", name: "Москва", countryCode: "ru", iata: "MOW" })}>
              Москва
            </Typography>,&nbsp;
            <Typography component="span" variant="caption" sx={{
              "&:hover": {
                color: 'gray',
                borderBottom: '1px dotted gray'
              },
              borderBottom: '1px dotted white',
              cursor: 'pointer'
            }} onClick={() => setCity({ label: "Санкт-Петербург, Россия", name: "Санкт-Петербург", countryCode: "ru", iata: "LED" })}>
              Санкт-Петербург
            </Typography>,&nbsp;
            <Typography component="span" variant="caption" sx={{
              "&:hover": {
                color: 'gray',
                borderBottom: '1px dotted gray'
              },
              borderBottom: '1px dotted white',
              cursor: 'pointer'
            }} onClick={() => setCity({ label: "Франкфурт, США", name: "Франкфурт", countryCode: "us", iata: "FFT" })}>
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
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ textAlign: 'left', width: '90%', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Button variant="text" sx={{ pl: 0, typography: 'caption' }} onClick={() => changeCheckbox(false)}>Очистить</Button>
          <span style={{color: '#3483fa'}}>/</span>
          <Button variant="text" sx={{ pr: 0, typography: 'caption' }} onClick={() => changeCheckbox(true)}>Выбрать все</Button>
            </Box>
            <List sx={{
              width: '90%',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              pt: 0,
              bgcolor: 'transparent',
              color: 'white',
              "& span:not(.Mui-checked) .MuiSvgIcon-root": {
                fill: 'white'
              }
            }}>
              {services.map((value, i) => {
                const labelId = `checkbox-list-label-${i}`;

                return (
                  <ListItem
                    key={'checkbox-' + i}
                    disablePadding
                  >
                    <ListItemButton sx={{ pl: 0 }} onClick={handleToggle(value)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={value[0]} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          {progress ? (<LinearProgress color="primary" sx={{ mx: 1 }} />) : (
            <>
              {services.length > 0 ? services.map((el, i) => (
                <React.Fragment key={'razdel' + i}>
                  {el[2] && (
                    <>
                      <Typography component="h3" variant="h4" color={'white'}>
                        {el[0] === "VIP-обслуживание" ? "VIP-зал" : el[0]}
                      </Typography>
                      <Box mt={2} mb={5}>
                      {el[1].map((el, i) => (
                        <Card key={'item' + el.id} sx={{ m: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            {el.interiorPhotos.length > 0 && (
                              <CardMedia
                                component="img"
                                sx={{ width: 151 }}
                                image={el.interiorPhotos[0]?.url?.replace('sandbox.', '') || ''}
                                alt={el.interiorPhotos[0]?.alt?.ru || "Image"}
                              />
                            )}
                            <CardContent sx={{ textAlign: 'left' }}>
                              <Typography component="div" variant="h5">
                                {el.name}
                              </Typography>
                              <Typography component="div" variant="body1" fontWeight={600}>
                                {el.flightType === "domestic" ? (
                                  <>
                                    <HomeIcon sx={{ verticalAlign: 'sub' }} /> Внутренний рейс, {el.type === "departure" ? "вылет" : el.type === "arrival" ? "прилет" : ""}
                                  </>
                                ) : el.flightType === "international" ? (
                                  <>
                                    <PublicIcon sx={{ verticalAlign: 'sub' }} /> Международный рейс, {el.type === "departure" ? "вылет" : el.type === "arrival" ? "прилет" : ""}
                                  </>
                                ) : (
                                  <>
                                    <PublicIcon sx={{ verticalAlign: 'sub' }} /> <HomeIcon sx={{ verticalAlign: 'sub' }} /> Международный или внутренний рейс, {el.type === "departure" ? "вылет" : el.type === "arrival" ? "прилет" : ""}
                                  </>
                                )}
                              </Typography>
                              <Button variant="text" sx={{ m: 1 }} onClick={() => handleClickOpen(el)}>Подробнее</Button>
                              <Button variant="contained" sx={{ m: 1 }}>Заказать</Button>
                            </CardContent>
                            <CardContent sx={{
                              marginLeft: 'auto',
                              alignItems: 'center',
                              display: 'flex'
                            }}>
                              <Typography component="div" variant="h5">
                                {el.priceGroup?.passengerCategories[el.priceGroup?.passengerCategories.length - 1]?.price ? (<>{el.priceGroup?.passengerCategories[el.priceGroup?.passengerCategories.length - 1].price?.value?.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' ₽ /'} <ManIcon sx={{ verticalAlign: 'middle' }} /></>) : ''}
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      ))}
                      </Box>
                    </>
                  )}
                </React.Fragment>
              )) : (<Typography component="h3" variant="h4" color={'white'}>Ничего не найдено!</Typography>)}
            </>
          )}
        </Grid>
      </Grid>
      <ServiceDescription open={open} setOpen={setOpen} serviceInfo={serviceInfo} />
    </Grid>
  )
});

export default Booking
