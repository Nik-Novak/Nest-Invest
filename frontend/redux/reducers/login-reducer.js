//@ts-check
const DEFAULTS = {
  investor: null,
  role: '',
  token: null
}

export default function reducer(
    state={...DEFAULTS},
    action
  ){

    switch(action.type){
      case 'LOGIN':
        let { investor, role, token } = action.payload;
        return {
          investor,
          role,
          token
        }
      case 'LOGOUT':
        return { ...DEFAULTS };
      default:
        return state;
    }
  }