//@ts-check
import { ListItemText, MenuItem, Chip, TextField, Checkbox, Autocomplete as MuiAutocomplete } from '@mui/material';
import React from 'react';

import { useRef, useState } from 'react';

function Autocomplete({ label='Label', options, value, onChange, multiple=false}){
  const [input, setInput] = useState('');
  const ignoreNextEmptyQueryUpdate = useRef(false);

  const renderOptions = (props, option)=>{
    return (
      <MenuItem key={option} {...props} value={option}>
        {multiple && <Checkbox checked={value.indexOf(option) > -1} />}
        <ListItemText primary={option} key={option} />
      </MenuItem>
    );
  }

  const renderTags = (value, getTagProps) => (
    value.map((option, index) => (
      <Chip
        className={getTagProps({index}).className}
        style={{backgroundColor:options.includes(option)?'':'red'}}
        data-tag-index={index} // This should work, but there's a bug in MUI Autocomplete
        key={option}
        label={option}
        onDelete={getTagProps({index}).onDelete}
        tabIndex={-1}
      />
    ))
  );

  const processMultipleInput = (event, newValue)=>{console.log("SLSLS")
    // console.log('test1',newValue);
    if(ignoreNextEmptyQueryUpdate.current && !newValue){ 
      ignoreNextEmptyQueryUpdate.current=false;
      return;
    }
    ignoreNextEmptyQueryUpdate.current=false;
    let potentialTerms = newValue.split(',').map(potentialTerm=>potentialTerm.trim())
    // console.log('test2',value);
    let matchedTerms = potentialTerms.filter((potentialTerm,i,potentialTerms)=> i<potentialTerms.length-1 && options.includes(potentialTerm) && !value?.includes(potentialTerm) );
    // console.log('test3',matchedTerms);
    setInput(input=>{
      if(matchedTerms.length){
        multiple ? onChange([...value, ...matchedTerms]) : onChange(matchedTerms[matchedTerms.length-1]);
        ignoreNextEmptyQueryUpdate.current=true;
      }
      return potentialTerms[potentialTerms.length-1]
    });
  }

  const processSingleInput = (event, newValue)=>{
    if(options.includes(newValue))
      onChange(newValue);
    setInput(newValue);
  }
  
  return(
    <MuiAutocomplete
      multiple={multiple}
      value={value}
      options={options}
      getOptionLabel={(option) => option }
      style={{ width: '100%', minWidth:400 }}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
      renderOption={renderOptions}
      renderTags={renderTags}
      onChange={(event,newValue)=>{if(newValue === value) return; newValue===null ? onChange('') : onChange(newValue);}}
      inputValue={input}
      onInputChange={multiple ? processMultipleInput : processSingleInput}
    />
  );
}

export default Autocomplete;