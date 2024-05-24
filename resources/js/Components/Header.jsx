import { Grid } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigator = useNavigate();

  return (
    <Grid container>
      <Grid item xs={12} sx={{
        px: 2,
        py: 4,
        textAlign: 'center'
      }}>
        <img src="/assets/images/logo.svg" alt="Logo" style={{ width: '100%', maxWidth: 220 }} onClick={() => navigator('/')} />
      </Grid>
    </Grid>
  )
}

export default Header
