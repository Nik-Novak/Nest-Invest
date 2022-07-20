//@ts-check
import moment from "moment";

export function updateDate(date) {
  if(!moment.isDate(new Date(date))) throw 'UPDATE_FILTER must have a valid date';
  return {
    type: 'UPDATE_FILTER_DATE',
    payload: {
      date:moment(date).format('MMMM DD, YYYY')
    }
  }
}

export function updateMarkets(markets) {
  if(!Array.isArray(markets)) throw 'UPDATE_FILTER must have a valid array of markets';
  return {
    type: 'UPDATE_FILTER_MARKETS',
    payload: {
      markets
    }
  }
}

export function updateCompanies(companies) {
  if(!Array.isArray(companies)) throw 'UPDATE_FILTER must have a valid array of companies';
  return {
    type: 'UPDATE_FILTER_COMPANIES',
    payload: {
      companies
    }
  }
}

// export function updateFilter(date, franchisees, locations) {
//   if(!moment.isDate(new Date(date))) throw 'UPDATE_FILTER must have a valid date';
//   if(!Array.isArray(franchisees)) throw 'UPDATE_FILTER must have a valid array of franchisees';
//   if(!Array.isArray(locations)) throw 'UPDATE_FILTER must have a valid array of locations';
//   return {
//     type: 'UPDATE_FILTER',
//     payload: {
//       date:moment(date).format('MMMM DD, YYYY'), franchisees, locations
//     }
//   }
// }