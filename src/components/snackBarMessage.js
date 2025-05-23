import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function SnackbarMessage({ open, message, severity = 'info', onClose, onExited, TransitionComponent, anchorOrigin = { vertical: 'top', horizontal: 'right' }, sx }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      onExited={onExited}
      anchorOrigin={anchorOrigin}
      TransitionComponent={TransitionComponent}
      sx={sx}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
