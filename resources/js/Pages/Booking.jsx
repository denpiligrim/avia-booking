import { Box, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Booking = () => {

    const [services, setServices] = useState([]);
    const [queryParameters] = useSearchParams();

    useEffect(() => {
        axios.get(`/api/services?iata=${queryParameters.get('iata')}&direction=${queryParameters.get('direction')}`)
            .then(function (res) {
                if (res.data.status) {
                    const data = res.data.result;
                    if (Array.isArray(data)) {
                        setServices(data);
                    } else {
                        setServices(data.result);
                    }
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }, [])
    return (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Grid container>
                <Grid item xs={12} md={4}>

                </Grid>
                <Grid item xs={12} md={8}>
                    {services.map((el, i) => (
                        <Card key={'item' + i} sx={{ display: 'flex', my: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 151 }}
                                    image={el.interiorPhotos[0]?.url?.replace('sandbox.', '') || ''}
                                    alt={el.interiorPhotos[0]?.alt?.ru || "Image"}
                                />
                                <CardContent>
                                    <Typography component="div" variant="h5">
                                        {el.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" component="div">
                                        {el.priceGroup?.passengerCategories[2]?.price ? el.priceGroup?.passengerCategories[2].price?.value?.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')  + ' ₽' : ''}
                                    </Typography>
                                </CardContent>
                            </Box>
                        </Card>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Booking
