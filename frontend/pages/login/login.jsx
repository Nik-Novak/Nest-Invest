//@ts-check
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import ChevronDownIcon from '@mui/icons-material/KeyboardArrowDown';

import Link from 'next/link';

import { useDispatch, useSelector } from "react-redux";

import { login } from '../../redux/actions/login-actions';
import store from '../../redux/store';
const dispatch = store.dispatch;
//@ts-ignore
import Style from './Login.module.css';
import { Alert, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useEffect } from 'react';

import { get } from '../../lib/fetch';
import { useState } from 'react';
import { useRouter } from 'next/router';

const DEFAULT_MAX_ACCOUNTS = 5;

function Login(){

  const [investors, setInvestors] = useState([]);
  const [networkError, setNetworkError] = useState('');
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

  const onMount = ()=>{
    get('/investors')
      .then(response=>{
        setInvestors(response.data);
      })
      .catch(err=>setNetworkError(err.message));
  };
  useEffect(onMount, []);

  const handleLogin = (investor, role, token) =>{
    get('/investor/'+investor._id)
      .then(result=>{
        dispatch(login(result.data, role, token));
        router.push('/dashboard');
      })
      .catch(err=>setNetworkError(err));
  }

  const renderableAccounts = useMemo(()=>{
    let endIndex = Math.min(DEFAULT_MAX_ACCOUNTS, investors.length);
    let shownInvestors = showAll ? investors : investors.slice(0, endIndex);
    return shownInvestors.map(investor=>{
      let firstName = investor.first_name;
      let lastName = investor.last_name;
      let role = 'User';
      let _id = investor._id;
      let token = _id;
      return (
        <Link key={_id}
          href=''
          >
          <a onClick={()=>{ handleLogin(investor) }}>
            <ListItem className={Style.list_item}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
              <ListItemText primary={`${firstName} ${lastName}`} secondary={role} />
            </ListItem>
          </a>
        </Link>
      );
    });
  }, [investors, showAll]);

  return (
    <div className={Style.content + ' content'}>
      {networkError && <Alert severity='error'>{networkError}</Alert>}
      <Paper sx={{p:5, minHeight: 500}} elevation={2}>
        <Typography variant='h5'>Login</Typography>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {renderableAccounts}
          {!showAll && 
            <ListItem sx={{cursor: 'pointer'}} onClick={()=>setShowAll(true)}>
              <Typography sx={{display: 'flex', alignItems:'center', margin: '0 auto'}}>Show All <ChevronDownIcon /></Typography>
            </ListItem>
          }
        </List>
      </Paper>
    </div>
  );
}

export default Login;