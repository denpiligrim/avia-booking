import React from 'react'
import { Grid, Stepper, Step, StepButton } from '@mui/material';
import { useState } from 'react';

const Checkout = () => {

    const [activeStep, setActiveStep] = useState(0);
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

    const handleStep = index => {
        const newArr = [...stepState];
        newArr[index].completed = true;
        setStepState([...newArr]);
        setActiveStep(index);
    };

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12} textAlign={'center'}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {stepState.map((el, index) => (
                            <Step key={'step-' + index} completed={el.completed}>
                                <StepButton sx={{
                                    color: 'white',
                                    "& .MuiStepLabel-label": {
                                        color: 'white !important'
                                    }
                                }} onClick={() => handleStep(index)}>
                                    {el.label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Checkout