import React, { useEffect } from 'react'
import { Grid, Stepper, Step, StepLabel, Button, Box, Typography, TextField, Stack, Divider, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [passengers, setPassengers] = useState([
        {
            firstName: '',
            lastName: '',
            passengerCategory: 0,
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
            passengerCategory: 0,
            birthDate: null
        });
        setPassengers([...newArr]);
    }

    const removePassenger = (i) => {
        const newArr = [...passengers];
        newArr.splice(i, 1);
        setPassengers([...newArr]);
    }

    const changeDepartureCity = (e) => {
        setDepartureCity(e.target.value);
    }

    const changeArrivalCity = (e) => {
        setArrivalCity(e.target.value);
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
                        const city = localServiceInfo.terminal.airport.city.name + ', ' + localServiceInfo.terminal.airport.city.country.name;
                        if (localServiceInfo.type === "departure") {
                            setDepartureCity(city);
                        } else {
                            setArrivalCity(city);
                        }
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
                    <Box sx={{ px: 4, py: 2, display: 'inline-block' }}>
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
                                    <TextField disabled={serviceInfo.type === "departure" ? true : false} value={departureCity} onChange={changeDepartureCity} placeholder="Город вылета" variant="outlined" />
                                    <TextField disabled={serviceInfo.type === "arrival" ? true : false} value={arrivalCity} onChange={changeArrivalCity} placeholder="Город прилета" variant="outlined" />
                                </Stack>
                                <Typography variant="h6" component="p" sx={{ color: 'white', mt: 1 }} gutterBottom>Пассажиры</Typography>
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
                                            <ToggleButton value="0">Взрослый</ToggleButton>
                                            <ToggleButton value="1">Ребенок 2-12 лет</ToggleButton>
                                            <ToggleButton value="2">Ребенок до 2 лет</ToggleButton>
                                        </ToggleButtonGroup>
                                        {el.passengerCategory !== 0 && (
                                            <>
                                                <Typography variant="body2" component="p" sx={{ color: 'white' }}>Дата рождения</Typography>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                                                    <DemoContainer components={['DatePicker']}>
                                                        <DatePicker
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