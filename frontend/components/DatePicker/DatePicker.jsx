//@ts-check
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

function DatePicker({value, onChange}){

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <DesktopDatePicker
      label="Date"
      inputFormat="MM/DD/YYYY"
      value={value}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} />}
    />
  </LocalizationProvider>
  );
}



export default DatePicker;