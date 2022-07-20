
import Router from 'next/router';

const redirectMiddleware = (store) => (next) => (action) => {
  switch(action.type){
    case 'LOGOUT': //If user dispatches a logout action, redirect to login page
      Router.replace('/login');
  }
  next(action);
}

export default redirectMiddleware;