import React, { useEffect } from 'react'
import { Grid, Stepper, Step, StepLabel, Button, Box, Typography, TextField, Stack, Divider, ToggleButtonGroup, ToggleButton, IconButton, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, FormControlLabel, FormControl, Select, MenuItem } from '@mui/material';
import ReactInputMask from "react-input-mask";
import TextareaAutosize from "react-autosize-textarea";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import CitiesSearch from '../Components/CitiesSearch';
import formValidator from '../helpers/formValidator';
import appState from '../store/appState';
import { observer } from 'mobx-react-lite';

const Checkout = observer(() => {

  const [store] = useState(appState);

  const [activeStep, setActiveStep] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceInfo, setServiceInfo] = useState({});
  const [data, setData] = useState({});
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [flight, setFlight] = useState('');
  const [additional, setAdditional] = useState([]);
  const [additionalHour, setAdditionaltHour] = useState([]);
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [otherIata, setOtherIata] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState([]);
  const [guests, setGuests] = useState([]);
  const [cars, setCars] = useState([]);
  const [name, setClientName] = useState("");
  const [phone, setClientPhone] = useState("");
  const [email, setClientEmail] = useState("");
  const [comment, setComment] = useState("");
  const [final, setFinal] = useState(false);
  const [passengers, setPassengers] = useState([
    {
      firstName: '',
      lastName: '',
      passengerCategory: 2,
      birthDate: null
    }
  ]);
  const [stepState, setStepState] = useState([
    {
      label: "Информация о рейсе и пассажирах",
      completed: false
    },
    {
      label: "Доп. услуги и сопровождающие",
      completed: false
    },
    {
      label: "Контакты и подтверждение",
      completed: false
    }
  ]);

  const changeAdditionalHour = (e, i) => {
    const newArr = [...additionalHour];
    newArr[i] = +e.target.value;
    setAdditionaltHour(newArr);
  }

  const calculateMinMaxDatesForUnder2 = () => {
    const currentDate = dayjs();
    return {
      minDateUnder2: currentDate.subtract(2, 'year'),
      maxDateUnder2: currentDate
    };
  };

  const calculateMinMaxDatesForBetween2And12 = () => {
    const currentDate = dayjs();
    return {
      minDateBetween2And12: currentDate.subtract(12, 'year'),
      maxDateBetween2And12: currentDate.subtract(2, 'year')
    };
  };

  const { minDateUnder2, maxDateUnder2 } = calculateMinMaxDatesForUnder2();
  const { minDateBetween2And12, maxDateBetween2And12 } = calculateMinMaxDatesForBetween2And12();

  const notify = (severity, text) => {
    store.openSnackbar(severity, text);;
  }

  const nextStep = () => {
    let currentIndex = activeStep;
    let newArr = stepState;
    let arr = [];

    if (currentIndex === 0) {
      arr = [
        {
          name: 'passengers',
          value: passengers
        },
        {
          name: 'flight',
          value: flight
        },
        {
          name: 'date',
          value: date
        },
        {
          name: 'time',
          value: time
        },
        {
          name: 'departure',
          value: arrivalCity
        },
        {
          name: 'arrival',
          value: departureCity
        }
      ];
    } else if (currentIndex === 1) {
      arr = [
        {
          name: 'guests',
          value: guests
        },
        {
          name: 'cars',
          value: cars
        }
      ];
    } else if (currentIndex === 2) {
      arr = [
        {
          name: 'name',
          value: name
        },
        {
          name: 'phone',
          value: phone
        },
        {
          name: 'email',
          value: email
        }
      ];
    }
    const validation = formValidator(arr);
    console.log(validation);
    const isValid = validation.isValid;
    if (!isValid) {
      if (validation.messages.length < 2) {
        notify('error', `Заполните корректно поле ${validation.messages[0]}!`);
      } else {
        notify('error', `Заполните корректно поля:<br> <ul style="margin: 0; padding-left: 15px;">${validation.messages.map(el => "<li>" + el + "</li>").join('')}</ul>`);
      }
      return;
    }
    newArr[currentIndex].completed = true;
    setStepState(newArr);
    setActiveStep(++currentIndex);
  };

  const prevStep = () => {
    let currentIndex = activeStep;
    setActiveStep(--currentIndex);
    setFinal(false);
  };

  const finalStep = () => {
    if (final) {
      axios.post('/api/payment', {
        sum: totalPrice,
        firstName: name,
        label: serviceInfo?.terminal?.label + ', ' + (serviceInfo?.type === "departure" ? "вылет" : serviceInfo?.type === "arrival" ? "прилет" : ""),
        email: email,
        phone: phone,
        flight: {
          flightNumber: flight,
          flightTime: date.format('YYYY-MM-DD') + 'T' + time.format('HH:mm:ss'),
          origin: serviceInfo.type === "departure" ? serviceInfo.terminal.airport.iata : otherIata,
          destination: serviceInfo.type === "arrival" ? serviceInfo.terminal.airport.iata : otherIata
        },
        serviceId: serviceInfo.id,
        partnerClientComment: comment,
        passengers: passengers,
        attendants: guests,
        cars: cars,
        additionalServices: additional,

      })
        .then(function (res) {
          if (res.data.status) {
            location.href = res.data.result;
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    setFinal(true);
  };

  const changePassCat = (i, val) => {
    const newArr = [...passengers];
    newArr[i].passengerCategory = parseInt(val);
    setPassengers([...newArr]);
  }

  const changePassDate = (i, val) => {
    const newArr = [...passengers];
    newArr[i].birthDate = val;
    setPassengers([...newArr]);
  }

  const changeName = (i, val) => {
    const newArr = [...passengers];
    const value = val.trim();
    newArr[i].firstName = value.slice(0, 1).toUpperCase() + value.slice(1);
    setPassengers([...newArr]);
  }

  const changeLastName = (i, val) => {
    const newArr = [...passengers];
    const value = val.trim();
    newArr[i].lastName = value.slice(0, 1).toUpperCase() + value.slice(1);
    setPassengers([...newArr]);
  }

  const addPassenger = () => {
    const newArr = [...passengers];
    newArr.push({
      firstName: '',
      lastName: '',
      passengerCategory: 2,
      birthDate: null
    });
    setPassengers([...newArr]);
  }

  const removePassenger = (i) => {
    const newArr = [...passengers];
    newArr.splice(i, 1);
    setPassengers([...newArr]);
  }

  const changeGuestName = (i, val) => {
    const newArr = [...guests];
    const value = val.trim();
    newArr[i].firstName = value.slice(0, 1).toUpperCase() + value.slice(1);
    setGuests([...newArr]);
  }

  const changeGuestLastName = (i, val) => {
    const newArr = [...guests];
    const value = val.trim();
    newArr[i].lastName = value.slice(0, 1).toUpperCase() + value.slice(1);
    setGuests([...newArr]);
  }

  const addGuest = () => {
    const newArr = [...guests];
    newArr.push({
      firstName: '',
      lastName: ''
    });
    setGuests([...newArr]);
  }

  const removeGuest = (i) => {
    const newArr = [...guests];
    newArr.splice(i, 1);
    setGuests([...newArr]);
  }

  const changeCarNumber = (i, val) => {
    const newArr = [...cars];
    const value = val.trim();
    newArr[i].number = value.toUpperCase();
    setCars([...newArr]);
  }

  const changeCarModel = (i, val) => {
    const newArr = [...cars];
    const value = val.trim();
    newArr[i].model = value;
    setCars([...newArr]);
  }

  const addCar = () => {
    const newArr = [...cars];
    newArr.push({
      number: '',
      model: '',
      later: false
    });
    setCars([...newArr]);
  }

  const removeCar = (i) => {
    const newArr = [...cars];
    newArr.splice(i, 1);
    setCars([...newArr]);
  }

  const changeCarLater = (i) => {
    const newArr = [...cars];
    newArr[i].later = !newArr[i].later;
    setCars([...newArr]);
  }

  const changeDepartureCity = (e) => {
    setDepartureCity(e.target.value);
  }

  const changeArrivalCity = (e) => {
    setArrivalCity(e.target.value);
  }

  const changeClientName = (val) => {
    let value = val.trim();
    value = value.slice(0, 1).toUpperCase() + value.slice(1);
    setClientName(value);
  }

  const changeClientPhone = (val) => {
    const value = val.trim();
    setClientPhone(value);
  }

  const changeClientEmail = (val) => {
    const value = val.trim();
    setClientEmail(value);
  }

  const changeComment = (val) => {
    setComment(val);
  }

  const accordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggle = (value, index) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    const newHour = [...additionalHour];

    if (currentIndex === -1) {
      let indexRemove = null;
      additional[index][1].forEach((el) => {
        const i = checked.indexOf(el);
        if (i !== -1) {
          indexRemove = i;
        }
      });
      if (indexRemove !== -1 && indexRemove !== null) {
        newChecked.splice(indexRemove, 1);
        newHour.splice(indexRemove, 1);
      }
      newChecked.push(value);
      newHour.push(1);
    } else {
      newChecked.splice(currentIndex, 1);
      newHour.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setAdditionaltHour(newHour);
  };

  useEffect(() => {
    const localServiceInfo = JSON.parse(localStorage.getItem('order'));
    setServiceInfo({ ...localServiceInfo });

    if (localServiceInfo) {
      axios.get(`/api/service?id=${localServiceInfo.id}`)
        .then(function (res) {
          if (res.data.status) {
            const data = res.data.result;
            setData(data.result);
            const city = localServiceInfo.terminal.airport.city.name + ', ' + localServiceInfo.terminal.airport.city.country.name;
            if (localServiceInfo.type === "departure") {
              setDepartureCity(city);
            } else {
              setArrivalCity(city);
            }
            let groupedObjects = localServiceInfo.priceGroup.additionalServices.reduce((acc, obj) => {
              acc[obj.typeLabel] = acc[obj.typeLabel] || [];
              acc[obj.typeLabel].push(obj);
              return acc;
            }, {});
            const entries = Object.entries(groupedObjects);
            setAdditional(entries);
            console.log(entries);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [])

  useEffect(() => {
    let sum = 0;
    const localServiceInfo = JSON.parse(localStorage.getItem('order'));
    passengers.forEach(el => {
      sum += localServiceInfo.priceGroup.passengerCategories[el.passengerCategory].price.value;
    });
    if (checked.length > 0) {
      checked.forEach((el, i) => {
        sum += el.price.value * additionalHour[i];
      });
    }
    setTotalPrice(sum);
  }, [passengers, checked, additionalHour])

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12} textAlign={'center'} px={4} pb={4}>
          <Stepper activeStep={activeStep}>
            {stepState.map((el, index) => (
              <Step key={'step-' + index} completed={el.completed}>
                <StepLabel sx={{
                  color: 'white',
                  "& .MuiStepLabel-label": {
                    color: 'white !important'
                  }
                }}>
                  {el.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
        <Grid item xs={12} textAlign={'center'} sx={{ color: 'white' }}>
          <Typography variant='body2' component={"p"}>{serviceInfo?.terminal?.label}, {serviceInfo?.type === "departure" ? "вылет" : serviceInfo?.type === "arrival" ? "прилет" : ""}</Typography>
          <Typography variant='h6' component={"p"}>{data?.common?.name} для {serviceInfo?.flightType === "domestic" ? "внутренних" : serviceInfo?.flightType === "international" ? "международных" : ""} рейсов</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ px: 4, py: 2, display: 'inline-block' }}>
            {activeStep === 0 ? (
              <>
                <Typography variant="h6" component="p" sx={{ color: 'white' }} gutterBottom>Рейс</Typography>
                <Typography variant="body2" component="p" sx={{ color: 'white' }}>Дата и время {serviceInfo.type === "departure" ? "вылета" : serviceInfo.type === "arrival" ? "прилета" : ""}</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      value={date}
                      onChange={(newValue) => setDate(newValue ? newValue : dayjs())}
                    />
                    <TimeField
                      value={time}
                      ampm={false}
                      onChange={(newValue) => setTime(newValue ? newValue : dayjs())}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <TextField id="outlined-basic" placeholder="Номер рейса" value={flight} onChange={(e) => setFlight(e.target.value.trim())} variant="outlined" sx={{ mt: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }} divider={<ArrowForwardIcon sx={{ my: 'auto !important', color: 'primary.main' }} />}>
                  {serviceInfo.type === "departure" ? (
                    <TextField disabled={serviceInfo.type === "departure" ? true : false} value={departureCity} onChange={changeDepartureCity} placeholder="Город вылета" variant="outlined" />
                  ) : (
                    <CitiesSearch flightType={serviceInfo.flightType} val={departureCity} changeVal={setDepartureCity} changeIata={setOtherIata} />
                  )}
                  {serviceInfo.type === "arrival" ? (
                    <TextField disabled={serviceInfo.type === "arrival" ? true : false} value={arrivalCity} onChange={changeArrivalCity} placeholder="Город прилета" variant="outlined" />
                  ) : (
                    <CitiesSearch flightType={serviceInfo.flightType} val={arrivalCity} changeVal={setArrivalCity} changeIata={setOtherIata} />
                  )}
                </Stack>
                <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Пассажиры</Typography>
                {passengers.map((el, i) => (
                  <Box key={'pass-' + i} sx={{
                    borderLeft: '2px solid #3483fa',
                    borderRadius: '4px',
                    p: 2,
                    mt: i !== 0 ? 1 : 0,
                    position: 'relative'
                  }}>
                    <Stack direction="row" spacing={2} divider={<Divider sx={{ color: 'primary.main' }} />}>
                      <TextField value={el.firstName} placeholder="Имя" variant="outlined" onChange={(e) => changeName(i, e.target.value)} />
                      <TextField value={el.lastName} placeholder="Фамилия" variant="outlined" onChange={(e) => changeLastName(i, e.target.value)} />
                    </Stack>
                    <ToggleButtonGroup
                      color="primary"
                      value={el.passengerCategory.toString()}
                      exclusive
                      onChange={(e, val) => changePassCat(i, val)}
                      aria-label="Platform"
                      sx={{
                        mt: 1,
                        "& .MuiButtonBase-root:not(.Mui-selected)": {
                          color: 'rgba(255, 255, 255, 0.54)'
                        }
                      }}
                    >
                      <ToggleButton value="2">Взрослый 12+</ToggleButton>
                      <ToggleButton value="1">Ребенок 2-12 лет</ToggleButton>
                      <ToggleButton value="0">Ребенок до 2 лет</ToggleButton>
                    </ToggleButtonGroup>
                    {el.passengerCategory !== 2 && (
                      <>
                        <Typography variant="body2" component="p" sx={{ color: 'white' }}>Дата рождения</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                          <DemoContainer components={['DatePicker']}>
                            <DatePicker
                              minDate={el.passengerCategory === 0 ? minDateUnder2 : minDateBetween2And12}
                              maxDate={el.passengerCategory === 0 ? maxDateUnder2 : maxDateBetween2And12}
                              value={el.birthDate}
                              onChange={(newValue) => changePassDate(i, newValue)}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </>
                    )}
                    {passengers.length > 1 && (
                      <IconButton color="primary" aria-label="remove pass" onClick={() => removePassenger(i)} sx={{
                        position: 'absolute',
                        top: -17,
                        right: 0
                      }}>
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Box textAlign={'center'}>
                  <IconButton color="primary" aria-label="add pass" onClick={addPassenger} sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mt: 1,
                    "&:hover": {
                      backgroundColor: 'primary.light'
                    }
                  }}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </>
            ) : activeStep === 1 ? (
              <>
                {additional.length > 0 && (
                  <>
                    <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Дополнительные услуги</Typography>
                    {additional.map((el, index) => (
                      <Accordion key={'panel' + index} expanded={el[1].some(elem => checked.includes(elem)) || expanded === 'panel' + index} onChange={accordion('panel' + index)}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={'panel' + index + '-content'}
                          id={'panel' + index + '-content'}
                        >
                          <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            {el[0]}
                          </Typography>
                          <Typography sx={{ color: 'text.secondary' }}>{el[1][0].description}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {el[1].map((el, i) => {
                              const labelId = `checkbox-list-label-${i}`;

                              return (
                                <ListItem
                                  key={i}
                                  sx={{
                                    "& .MuiListItemSecondaryAction-root": {
                                      display: "flex"
                                    }
                                  }}
                                  secondaryAction={
                                    <>
                                      {checked.indexOf(el) !== -1 && (
                                        <FormControl sx={{ mr: 1, minWidth: 120 }} size="small">
                                          <Select
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={additionalHour[checked.indexOf(el)]}
                                            onChange={(e) => changeAdditionalHour(e, checked.indexOf(el))}
                                          >
                                            <MenuItem value={1}>1 час</MenuItem>
                                            <MenuItem value={2}>2 часа</MenuItem>
                                            <MenuItem value={3}>3 часа</MenuItem>
                                            <MenuItem value={4}>4 часа</MenuItem>
                                            <MenuItem value={5}>5 часов</MenuItem>
                                          </Select>
                                        </FormControl>
                                      )}
                                      <Typography variant="body1" component="p" sx={{ display: 'flex', alignItems: 'center' }}>{el.price.value.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' ₽/час'}</Typography>
                                    </>
                                  }
                                  disablePadding
                                >
                                  <ListItemButton role={undefined} onClick={handleToggle(el, index)} dense>
                                    <ListItemIcon>
                                      <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(el) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={el.name} />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </>
                )}
                <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Сопровождающие</Typography>
                <Typography variant="body2" component="p" sx={{ color: 'white' }} gutterBottom>Это те, кто не летит, но будут в ВИП-зале вместе с вами.</Typography>
                {guests.map((el, i) => (
                  <Box key={'pass-' + i} sx={{
                    borderLeft: '2px solid #3483fa',
                    borderRadius: '4px',
                    display: 'inline-block',
                    p: 2,
                    mt: i !== 0 ? 1 : 0,
                    position: 'relative'
                  }}>
                    <Stack direction="row" spacing={2} divider={<Divider sx={{ color: 'primary.main' }} />}>
                      <TextField value={el.firstName} placeholder="Имя" variant="outlined" onChange={(e) => changeGuestName(i, e.target.value)} />
                      <TextField value={el.lastName} placeholder="Фамилия" variant="outlined" onChange={(e) => changeGuestLastName(i, e.target.value)} />
                    </Stack>
                    <IconButton color="primary" aria-label="remove pass" onClick={() => removeGuest(i)} sx={{
                      position: 'absolute',
                      top: -17,
                      right: 0
                    }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
                <br />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AddIcon />} onClick={addGuest}>
                  Добавить сопровождающего
                </Button>
                <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Автомобили</Typography>
                <Typography variant="body2" component="p" sx={{ color: 'white' }} gutterBottom>Для того, чтобы автомобиль пропустили на парковку аэропорта, нужно сообщить данные. Вы можете сделать это позже.</Typography>
                {cars.map((el, i) => (
                  <Box key={'pass-' + i} sx={{
                    borderLeft: '2px solid #3483fa',
                    borderRadius: '4px',
                    display: 'inline-block',
                    p: 2,
                    mt: i !== 0 ? 1 : 0,
                    position: 'relative'
                  }}>
                    <Stack direction="row" spacing={2} divider={<Divider sx={{ color: 'primary.main' }} />}>
                      <TextField disabled={el.later ? true : false} value={el.later ? '' : el.number} placeholder="Гос. номер" variant="outlined" onChange={(e) => changeCarNumber(i, e.target.value)} />
                      <TextField disabled={el.later ? true : false} value={el.later ? '' : el.model} placeholder="Марка автомобиля" variant="outlined" onChange={(e) => changeCarModel(i, e.target.value)} />
                    </Stack>
                    <FormControlLabel sx={{
                      color: 'white',
                      "& span:not(.Mui-checked) .MuiSvgIcon-root": {
                        fill: 'white'
                      }
                    }} control={<Checkbox checked={el.later} onClick={() => changeCarLater(i)} />} label="Сообщить позже" />
                    <IconButton color="primary" aria-label="remove pass" onClick={() => removeCar(i)} sx={{
                      position: 'absolute',
                      top: -17,
                      right: 0
                    }}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
                <br />
                <Button sx={{ mt: 2 }} variant="contained" startIcon={<AddIcon />} onClick={addCar}>
                  Добавить автомобиль
                </Button>
              </>
            ) : (
              <>
                {!final ? (
                  <>
                    <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Контактная информация</Typography>
                    <Box><TextField value={name} placeholder="Имя" variant="outlined" onChange={(e) => changeClientName(e.target.value)} /></Box>
                    <Box>
                      <ReactInputMask mask="+7 (999) 999-99-99" value={phone} onChange={(event) => changeClientPhone(event.target.value)}>
                        <TextField
                          label="Телефон"
                          variant="outlined"
                          required
                          sx={{
                            width: '100%',
                            maxWidth: '250px'
                          }}
                        />
                      </ReactInputMask>
                    </Box>
                    <Box><TextField value={email} placeholder="Email" variant="outlined" onChange={(e) => changeClientEmail(e.target.value)} /></Box>
                    <Typography variant="h6" component="p" sx={{ color: 'white', mt: 3 }} gutterBottom>Комментарий</Typography>
                    <TextareaAutosize
                      rows={1}
                      placeholder='Комментарий'
                      value={comment}
                      onChange={(event) => changeComment(event.target.value)}
                      style={{
                        width: '100%',
                        lineHeight: '1.5',
                        padding: '16.5px 14px',
                        border: '1px solid #3483fa',
                        borderRadius: '4px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '1rem'
                      }}
                    />
                  </>
                ) : (
                  <Box sx={{ background: 'white' }} p={2}>
                    <Typography variant="h6" component="p" gutterBottom>Рейс</Typography>
                    <Typography variant="body1" component="p">Дата и время {serviceInfo.type === "departure" ? "вылета" : serviceInfo.type === "arrival" ? "прилета" : ""}</Typography>
                    <Typography variant="body2" component="p">{dayjs(date).format('DD.MM.YYYY') + " " + dayjs(time).format('HH:mm')}</Typography>
                    <Typography variant="body1" component="p">Номер рейса и направление</Typography>
                    <Typography variant="body2" component="p">{flight}</Typography>
                    <Typography variant="body2" component="p">{departureCity + " — " + arrivalCity}</Typography>
                    <Typography variant="h6" component="p" gutterBottom>Пассажиры</Typography>
                    {passengers.map(el => (
                      <>
                        <Typography variant="body1" component="p">{el.firstName + " " + el.lastName}</Typography>
                        <Typography variant="body1" component="p">{el.birthDate ? dayjs(el.birthDate).format('DD.MM.YYYY') : 'взрослый'}</Typography>
                      </>
                    ))}
                    <Typography variant="h6" component="p" gutterBottom>Дополнительные услуги</Typography>
                    {additional.length > 0 && checked.length > 0 ? (
                      <>
                        {additional.map((el, i) => (
                          <React.Fragment key={'label' + i}>
                            <Typography variant="body1" component="p">{el[1].filter(item => checked.includes(item)).length > 0 ? el[0] : ''}</Typography>
                            {el[1].filter(item => checked.includes(item)).map((el, index) => (
                              <React.Fragment key={'label2' + index}>
                                <Typography variant="body2" component="p">{el.name + ' ' + el.price.value.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' ₽'}</Typography>
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                      </>
                    ) : (
                      <Typography variant="body2" component="p">Нет</Typography>
                    )}
                    <Typography variant="h6" component="p" gutterBottom>Сопровождающие</Typography>
                    {guests.length > 0 ? guests.map((el, i) => (
                      <React.Fragment key={'guest' + i}>
                        <Typography variant="body2" component="p">{el.lastName + ' ' + el.firstName}</Typography>
                      </React.Fragment>
                    )) : <Typography variant="body2" component="p">Нет</Typography>}
                    <Typography variant="h6" component="p" gutterBottom>Автомобили</Typography>
                    {cars.length > 0 ? cars.map((el, i) => (
                      <React.Fragment key={'car' + i}>
                        {el.later ? (
                          <Typography variant="body2" component="p">Автомобиль (модель и номер сообщу позже)</Typography>
                        ) : (
                          <Typography variant="body2" component="p">{el.model + ' ' + el.number}</Typography>
                        )}
                      </React.Fragment>
                    )) : <Typography variant="body2" component="p">Нет</Typography>}
                    <Typography variant="body2" component="p"></Typography>
                    <Typography variant="body1" component="p"></Typography>
                    <Typography variant="body2" component="p"></Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
          <Box px={4}>
            <Typography variant="body2" component="p" sx={{ color: 'white' }} gutterBottom>Итоговая стоимость</Typography>
            <Typography variant="h5" component="p" sx={{ color: 'white', mt: 1 }} gutterBottom>{totalPrice.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + ' ₽'}</Typography>
          </Box>
          <Box textAlign={'center'}>
            <Button variant="text" onClick={prevStep} sx={{ display: activeStep === 0 ? 'none' : 'inline-flex' }}>Назад</Button>
            <Button variant="contained" onClick={nextStep} sx={{ display: activeStep === 2 ? 'none' : 'inline-flex' }}>Вперед</Button>
            <Button variant="contained" onClick={finalStep} sx={{ display: activeStep === 2 ? 'inline-flex' : 'none' }}>{final ? 'К оплате' : 'Подтвердить'}</Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
});
export default Checkout;