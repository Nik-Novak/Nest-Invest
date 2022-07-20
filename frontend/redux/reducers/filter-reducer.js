//@ts-check
import moment from 'moment';

function isEqual(p, q){
  if(p.length !== q.length)
        return false;//@ts-ignore
  for(let i=0; i<p.length; i++)
    if(p[i]._id!==q[i]._id)
      return false;
  return true;
}

const DEFAULTS = {
  date: moment(new Date()).format('MMMM DD, YYYY'),
  markets: [],
  companies:[]
}
export default function reducer(state={...DEFAULTS}, action) {
  switch(action.type) {
    case 'UPDATE_FILTER_DATE':{
      let { date } = action.payload;
      return {
        ...state,
        date
      }
    }
    case 'UPDATE_FILTER_MARKETS': {
      let { markets } = action.payload;
      let notEqualValue = {
        ...state,
        markets
      };
      if(!isEqual(markets, state.markets))
        return notEqualValue
      return state; //save heavy tree computations by not updating state when possible
    }
    case 'UPDATE_FILTER_COMPANIES': {
      let { companies } = action.payload;
      let notEqualValue = {
        ...state,
        companies
      };
      if(!isEqual(companies, state.companies))
        return notEqualValue
      return state; //save heavy tree computations by not updating state when possible
    }
    case 'CLEAR_FILTER':
      return { ...DEFAULTS }
    default:
      return state;
  }
}