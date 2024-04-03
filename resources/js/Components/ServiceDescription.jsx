import { useTheme } from '@emotion/react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';

const ServiceDescription = ({ open, setOpen, serviceInfo }) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [data, setData] = useState({});

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (serviceInfo.id) {
      axios.get(`/api/service?id=${serviceInfo.id}`)
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
  }, [serviceInfo])

  return (
    <>
      {serviceInfo?.id && data?.common && (
        <Dialog
          fullScreen={fullScreen}
          maxWidth="lg"
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" sx={{ backgroundColor: 'primary.main', color: 'white', position: 'relative' }}>
            <Typography variant='body2' component={"p"}>{serviceInfo.terminal.label}, {serviceInfo.type === "departure" ? "вылет" : serviceInfo.type === "arrival" ? "прилет" : ""}</Typography>
            <Typography variant='h6' component={"h3"}>{data.common.name} для {serviceInfo.flightType === "domestic" ? "внутренних" : serviceInfo.flightType === "international" ? "международных" : ""} рейсов</Typography>
            <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', top: 5, right: 5 }}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{p: 0}}>
              <Box sx={{
                width: '100%',
                height: '300px',
                background: `url(${data.common.interior_photos[0]?.url?.replace('sandbox.', '')})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}>

              </Box>
            <DialogContentText sx={{p: 2}}>
              {data.common.detailed_description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default ServiceDescription
