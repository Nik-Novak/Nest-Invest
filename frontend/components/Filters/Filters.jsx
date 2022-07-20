//@ts-check

import DatePicker from '../DatePicker/DatePicker';
import { useEffect, useState } from 'react';
import Autocomplete from '../Autocomplete/Autocomplete';
import { updateDate, updateMarkets, updateCompanies } from '../../redux/actions/filter-actions';
import store from '../../redux/store';
import axios from 'axios';
//@ts-ignore
import Style from './Filters.module.css'
import { Alert, Box, Checkbox, Fab, FormControlLabel, Popover, Stack, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import React from 'react';
import { get, post } from '../../lib/fetch';
import { useMemo } from 'react';
import { connect } from 'react-redux';

function getNewMarketOptions(params){
  return new Promise((resolve, reject)=>{
    let token = store.getState().login.token;
    get('/markets', {params}).then(response=>resolve(response.data));
  });
}

function getNewCompanyOptions(params){
  return new Promise((resolve, reject)=>{
    let token = store.getState().login.token;
    get('/companies', {params}).then(response=>resolve(response.data));
  });
}

function convertListToObject(propertyKey, list){
  let returnObj = {};
  for(let item of list){
    let key = item[propertyKey];
    returnObj[key] = item;
  }
  return returnObj;
}

const mapStateToProps = (state)=>{
  let ownedMarkets = [];
  for( let c of state.login.investor.company_ids){
    ownedMarkets.push(c.market_tag_id);
  }
  // let markets = await get('/markets', { params:{ market_ids:marketIds } });
  return {
    ownedMarkets: convertListToObject('_id', ownedMarkets),
    ownedCompanies: convertListToObject('_id', state.login.investor.company_ids),
    filter: state.filter
  }
}

const filterOwned = (list, owned) => {
  return list.filter(item=>owned[item._id]);
}

function Filters({filter, ownedCompanies, ownedMarkets}){

  const [date, setDate] = useState(new Date());
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [marketOptions, setMarketOptions] = useState({});
  const [companyOptions, setCompanyOptions] = useState({});
  const [showOwnedOnly, setShowOwnedOnly] = useState(true);
  const [networkError, setNetworkError] = useState('');

  const [filtersPopoverAnchorElem, setFiltersPopoverAnchorElem] = useState(null);

  const updateOptions = ()=>{
    let selectedCompanyIds = selectedCompanies.reduce((filtered, name)=>{
      if(companyOptions[name])//@ts-ignore
        filtered.push(companyOptions[name]._id);
      return filtered;
    }, []);
    let selectedMarketIds = selectedMarkets.reduce((filtered, name)=>{
      if(marketOptions[name])//@ts-ignore
        filtered.push(marketOptions[name]._id);
      return filtered;
    }, []);

    getNewMarketOptions({company_ids:selectedCompanyIds})
      .then(async markets=>{
        let filteredMarkets = showOwnedOnly ? filterOwned(markets, ownedMarkets) : markets;
        let newMarketOptions = convertListToObject('name', filteredMarkets);
        
        setMarketOptions(newMarketOptions);
      })
      .catch(err=>setNetworkError(err.message))
    getNewCompanyOptions({market_ids:selectedMarketIds})
      .then(async companies=>{
        let filteredCompanies = showOwnedOnly ? filterOwned(companies, ownedCompanies) : companies;
        let newCompanyOptions = convertListToObject('name', filteredCompanies);
        
        setCompanyOptions(newCompanyOptions);
      })
      .catch(err=>setNetworkError(err.message));
  };
  useEffect(updateOptions, [showOwnedOnly, selectedMarkets, selectedCompanies]);

  const dispatchCompanies = (newSelectedCompanyNames) =>{
    let newSelectedCompanies = newSelectedCompanyNames.reduce((filtered, name)=>{
      let company = companyOptions[name];
      if(company)
        filtered.push(company);
      return filtered;
    }, []);
    if(!newSelectedCompanies.length){
      let options = Object.values(companyOptions);
      newSelectedCompanies = showOwnedOnly ? options.filter(c=>ownedCompanies[c._id]) : options;
    }
    store.dispatch(updateCompanies(filterOwned(newSelectedCompanies, ownedCompanies))); //only owned companies count
  }
  useEffect(()=>dispatchCompanies(selectedCompanies), [ companyOptions ]);
  
  const dispatchMarkets = (newSelectedMarketNames) => {
    let newSelectedMarkets = newSelectedMarketNames.reduce((filtered, name)=>{
      let market = marketOptions[name];
      if(market)
      filtered.push(market);
      return filtered;
    }, []);
    if(!newSelectedMarkets.length){
      let options = Object.values(marketOptions)
      newSelectedMarkets = showOwnedOnly ? options.filter(m=>ownedMarkets[m._id]) : options; //if no filters, default to all owned markets
    }
    store.dispatch(updateMarkets(filterOwned(newSelectedMarkets, ownedMarkets)));
  }
  useEffect(()=>dispatchMarkets(selectedMarkets), [ marketOptions, companyOptions ]);

  const onMount = ()=>{
    handleMarketsChange([]);
    handleCompaniesChange([]);
  }
  useEffect(onMount, []); //initialize filters using existing change handlers

  const handleDateChange = (newDate)=>{
    setDate( newDate );
    store.dispatch(updateDate( newDate ));
  }

  const handleMarketsChange = async (newSelectedMarketNames) => {
    setSelectedMarkets(newSelectedMarketNames);
  }

  const handleCompaniesChange = (newSelectedCompanyNames) =>{
    setSelectedCompanies(newSelectedCompanyNames);
  }

  const handleShowOwnedChange = (evt)=>{
    setShowOwnedOnly(evt.target.checked);
  }

  const handleFabClick = (event) =>{
    setFiltersPopoverAnchorElem(event.target);
  }

  const handlePopoverClose = ()=>{
    setFiltersPopoverAnchorElem(null);
  }

  const isPopoverOpen = Boolean(filtersPopoverAnchorElem);

  return(
    <div className={Style.filters}>
      <Fab 
        sx={{position: 'fixed', bottom:'2vh'}} 
        variant="extended"
        onClick={handleFabClick}
        >
        <FilterListIcon sx={{ mr: 1 }} />
        Filter
      </Fab>
      <Popover
        open={isPopoverOpen}
        anchorEl={filtersPopoverAnchorElem}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Box sx={{p:4}}>
          {networkError && <Alert severity='error'>{networkError}</Alert>}
          <Stack spacing={1}>
            <DatePicker value={date} onChange={handleDateChange}/>
            <Autocomplete label='Markets' multiple value={selectedMarkets} onChange={handleMarketsChange} options={Object.keys(marketOptions)} />
            <Autocomplete label='Companies' multiple value={selectedCompanies} onChange={handleCompaniesChange} options={Object.keys(companyOptions)} />
            <FormControlLabel label='Show Owned Options Only' control={<Checkbox checked={showOwnedOnly} onChange={handleShowOwnedChange} />} />
          </Stack>
        </Box>
      </Popover>
      
    </div>
  );

}

export default connect(mapStateToProps)(Filters);