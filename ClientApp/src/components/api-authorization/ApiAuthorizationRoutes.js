
//
import { Login } from './Login'
import React from 'react';
import { Logout } from './Logout'
import { ApplicationPaths, LoginActions, LogoutActions } from './ApiAuthorizationConstants';

/* defines routes for components related 
to authentication actions such as login, logout, profile
 access, and registration, imports components for 
 login and logout from separate files and constructs an 
 array of route objects, each specifying a path and the 
 corresponding component to render based on the 
 authentication action */

const ApiAuthorizationRoutes = [
  {
    path: ApplicationPaths.Login,
    element: loginAction(LoginActions.Login)
  },
  {
    path: ApplicationPaths.LoginFailed,
    element: loginAction(LoginActions.LoginFailed)
  },
  {
    path: ApplicationPaths.LoginCallback,
    element: loginAction(LoginActions.LoginCallback)
  },
  {
    path: ApplicationPaths.Profile,
    element: loginAction(LoginActions.Profile)
  },
  {
    path: ApplicationPaths.Register,
    element: loginAction(LoginActions.Register)
  },
  {
    path: ApplicationPaths.LogOut,
    element: logoutAction(LogoutActions.Logout)
  },
  {
    path: ApplicationPaths.LogOutCallback,
    element: logoutAction(LogoutActions.LogoutCallback)
  },
  {
    path: ApplicationPaths.LoggedOut,
    element: logoutAction(LogoutActions.LoggedOut)
  }
];

function loginAction(name){
  return <Login action={name}></Login>;
}

function logoutAction(name) {
  return <Logout action={name}></Logout>;
}

export default ApiAuthorizationRoutes;
