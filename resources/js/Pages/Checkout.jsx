import React, { useEffect } from 'react'
import { Grid, Stepper, Step, StepLabel, Button, Box, Typography, TextField, Stack, Divider, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const Checkout = () => {

  const [activeStep, setActiveStep] = useState(0);
  const [serviceInfo, setServiceInfo] = useState({});
  const [data, setData] = useState({});
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [passengers, setPassengers] = useState([
    {
      firstName: '',
      lastName: '',
      passengerCategory: 0,
      birthDate: dayjs()
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

  const nextStep = () => {
    let currentIndex = activeStep;
    let newArr = stepState;
    newArr[currentIndex].completed = true;
    setStepState(newArr);
    setActiveStep(++currentIndex);
  };

  const prevStep = () => {
    let currentIndex = activeStep;
    setActiveStep(--currentIndex);
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

  useEffect(() => {
    const localServiceInfo = JSON.parse(localStorage.getItem('order'));
    setServiceInfo({ ...localServiceInfo });

    if (localServiceInfo) {
      axios.get(`/api/service?id=${localServiceInfo.id}`)
        .then(function (res) {
          if (res.data.status) {
            const data = res.data.result;
            setData(data.result);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [])

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
        <Grid item xs={12}>
          <Box sx={{ px: 4, py: 2 }}>
            {activeStep === 0 ? (
              <>
                <Typography variant="h6" component="p" sx={{ color: 'white' }} gutterBottom>Рейс</Typography>
                <Typography variant="body2" component="p" sx={{ color: 'white' }}>Дата и время {serviceInfo.type === "departure" ? "вылета" : serviceInfo.type === "arrival" ? "прилета" : ""}</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      value={date}
                      onChange={(newValue) => setDate(newValue)}
                    />
                    <TimeField
                      value={time}
                      ampm={false}
                      onChange={(newValue) => setTime(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <TextField id="outlined-basic" placeholder="Номер рейса" variant="outlined" sx={{ mt: 2 }} />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }} divider={<ArrowForwardIcon sx={{ my: 'auto !important', color: 'primary.main' }} />}>
                  <TextField id="outlined-basic" placeholder="Город вылета" variant="outlined" />
                  <TextField id="outlined-basic" placeholder="Город прилета" variant="outlined" />
                </Stack>
                <Typography variant="h6" component="p" sx={{ color: 'white', mt: 1 }} gutterBottom>Пассажиры</Typography>
                {passengers.map((el, i) => (
                  <Box key={'pass-' + i} sx={{
                    border: '1px solid #3483fa',
                    borderRadius: '4px',
                    display: 'inline-block',
                    p: 2
                  }}>
                    <Stack direction="row" spacing={2} divider={<Divider sx={{ color: 'primary.main' }} />}>
                      <TextField id="outlined-basic" placeholder="Имя" variant="outlined" />
                      <TextField id="outlined-basic" placeholder="Фамилия" variant="outlined" />
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
                      <ToggleButton value="0">Взрослый</ToggleButton>
                      <ToggleButton value="1">Ребенок 2-12 лет</ToggleButton>
                      <ToggleButton value="2">Ребенок до 2 лет</ToggleButton>
                    </ToggleButtonGroup>
                    {el.passengerCategory !== 0 && (
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker
                            value={el.birthDate}
                            onChange={(newValue) => changePassDate(i, newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    )}
                  </Box>
                ))}
                <br />
                <IconButton color="primary" aria-label="add pass">
                  <AddIcon />
                </IconButton>
              </>
            ) : activeStep === 1 ? (
              <>
                2
              </>
            ) : (
              <>
                3
              </>
            )}
          </Box>
          <Button variant="text" onClick={prevStep} sx={{ display: activeStep === 0 ? 'none' : 'inline-flex' }}>Назад</Button>
          <Button variant="text" onClick={nextStep} sx={{ display: activeStep === 2 ? 'none' : 'inline-flex' }}>Вперед</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Checkout