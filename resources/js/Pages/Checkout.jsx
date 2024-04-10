import React, { useEffect } from 'react'
import { Grid, Stepper, Step, StepLabel, Button, Box, Typography } from '@mui/material';
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

    useEffect(() => {
        const localServiceInfo = JSON.parse(localStorage.getItem('order'));
        setServiceInfo({...localServiceInfo});

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
                <Grid item xs={12} textAlign={'center'}>
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
                <Grid item xs={12} textAlign={'center'}>
                    <Box>
                        {activeStep === 0 ? (
                            <>
                            <Typography variant="body2" component="p">Дата и время {serviceInfo.type === "departure" ? "вылета" : serviceInfo.type === "arrival" ? "прилета" : ""}</Typography>
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