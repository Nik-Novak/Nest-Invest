//@ts-check
import { useEffect, useState } from 'react';
import store from '../redux/store';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const mapState = (store)=>{
  return {
    token: store.login.token
  }
}

function AuthGuard({children, token, redirectUrl}) {
  const { asPath, replace } = useRouter();
  let currentPath = asPath.toLowerCase();
  const isAuthenticated = token!==null;
  const displayChildren = isAuthenticated || currentPath === redirectUrl.toLowerCase();

  const redirectOnNoAuth = ()=>{
    let alreadyAtRedirect = currentPath === redirectUrl.toLowerCase();
    if(!isAuthenticated && !alreadyAtRedirect)
      replace(redirectUrl);
  }
  
  useEffect(redirectOnNoAuth, [token, currentPath]);

  return displayChildren && children;
}

export default connect(mapState)(AuthGuard);