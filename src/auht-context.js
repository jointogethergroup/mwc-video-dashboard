import React from 'react';
import jwt from 'jsonwebtoken'


const authContext = React.createContext({
  token: null,
  authenticated: false,
  event_id:0,
  email:'',
  login: (token) => {
    try {
        const decoded = jwt.decode(token, {complete: true});
        const exp = decoded.payload.exp;
        if (exp > 0 && Date.now() >= exp * 1000) {
            return false;   // expired
          }   else {            
            return true;    // active
          }    
    } catch (error) {        
        return false;
    }
    
  },
  autoLogin: () => {
    const storedToken = localStorage.getItem('mwc.video.dashboard.token');    
    if (storedToken) {
        const decoded = jwt.decode(storedToken, {complete: true});        
        const exp = decoded.payload.exp;
        if (exp > 0 && Date.now() >= exp * 1000) {
            return false;
          }   else {            
            return true;
          }
    } else {
        return false;
    }
  }
});

export default authContext;