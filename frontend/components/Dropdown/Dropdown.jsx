//@ts-check

import { Select, MenuItem, Checkbox, ListItemText, OutlinedInput} from "@mui/material";
import React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const renderOptions = (options, value, multiple)=>{
  return options.map((option) => (
    <MenuItem key={option} value={option}>
      {multiple && <Checkbox checked={value.indexOf(option) > -1} />}
      <ListItemText primary={option} />
    </MenuItem>
  ));
}

function Dropdown({options, value, onChange, multiple=false}){

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    multiple ? 
      onChange( typeof value === 'string' ? value.split(',') : value )
      : onChange( value );
  };

  const renderValue = (selected) => multiple ? selected.join(', ') : selected;

  return (
    <Select
      multiple={multiple}
      value={value}
      onChange={handleChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={renderValue}
      MenuProps={MenuProps}
    >
      {renderOptions(options, value, multiple)}
    </Select>
  );
}

export default Dropdown;