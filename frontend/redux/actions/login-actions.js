
export function login(investor, role, token){
  return {
    type: 'LOGIN',
    payload: {
      investor, role, token
    }
  }
}

export function logout(){
  return {
    type: 'LOGOUT',
    payload: {}
  }
}
