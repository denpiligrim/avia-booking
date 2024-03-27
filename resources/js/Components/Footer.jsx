import { Grid, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{
        px: 2,
        py: 4,
        textAlign: 'center'
      }}>
        <Typography variant='h4' component={'p'} sx={{ color: 'white' }}>
          FOOTER
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Footer
