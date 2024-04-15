import React from 'react'
import { Component } from 'react';
import authService from './AuthorizeService';
import { AuthenticationResultStatus } from './AuthorizeService';
import { QueryParameterNames, LogoutActions, ApplicationPaths } from './ApiAuthorizationConstants';

/* Manages user logout functionality based on different 
actions such as initiating logout, processing logout 
callback, and displaying logout success or failure 
messages. It interacts with the AuthorizeService to 
handle logout tasks and redirect users appropriately 
based on their actions and authentication results. */

//class component with a constructor that 
//initializes the state with properties
export class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: undefined,
      isReady: false,
      authenticated: false
    };
  }

  //checks the action passed via props and performs different 
  //actions accordingly
  componentDidMount() {
    const action = this.props.action;
    switch (action) {
      case LogoutActions.Logout:
        //checks if the logout was initiated from within the 
        //page or not. If it was initiated locally, it proceeds with 
        //the logout process by calling the logout method with the 
        //return URL. Otherwise, it sets the state to indicate that 
        //the logout was not initiated from within the page.
        if (!!window.history.state.usr.local) {
          this.logout(this.getReturnUrl());
        } else {
          this.setState({ isReady: true, message: "The logout was not initiated from within the page." });
        }
        break;
        //If the action is LogoutCallback, it processes the logout callback
      case LogoutActions.LogoutCallback:
        this.processLogoutCallback();
        break;
        //If the action is LoggedOut, it sets the state to 
        //indicate that the user has successfully logged out.
      case LogoutActions.LoggedOut:
        this.setState({ isReady: true, message: "You successfully logged out!" });
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }

    this.populateAuthenticationState();
  }

  //renders different content based on the state 
  //and the action passed via props
  render() {
    const { isReady, message } = this.state;
    if (!isReady) {
      return <div></div>
    }
    if (!!message) {
      return (<div>{message}</div>);
    } else {
      const action = this.props.action;
      switch (action) {
        case LogoutActions.Logout:
          return (<div>Processing logout</div>);
        case LogoutActions.LogoutCallback:
          return (<div>Processing logout callback</div>);
        case LogoutActions.LoggedOut:
          return (<div>{message}</div>);
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  //handles the logout process, checking the authentication status, 
  //signing out if authenticated, and updating the component's 
  //state accordingly
  async logout(returnUrl) {
    const state = { returnUrl };
    const isauthenticated = await authService.isAuthenticated();
    if (isauthenticated) {
      const result = await authService.signOut(state);
      switch (result.status) {
        case AuthenticationResultStatus.Redirect:
          break;
        case AuthenticationResultStatus.Success:
          await this.navigateToReturnUrl(returnUrl);
          break;
        case AuthenticationResultStatus.Fail:
          this.setState({ message: result.message });
          break;
        default:
          throw new Error("Invalid authentication result status.");
      }
    } else {
      this.setState({ message: "You successfully logged out!" });
    }
  }

  //processes the logout callback, completing the sign-out process 
  //and updating the component's state based on the result
  async processLogoutCallback() {
    const url = window.location.href;
    const result = await authService.completeSignOut(url);
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        throw new Error('Should not redirect.');
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state));
        break;
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message });
        break;
      default:
        throw new Error("Invalid authentication result status.");
    }
  }

  // Checks if user is auth,
  // updates component state with auth status

  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ isReady: true, authenticated });
  }

  // Retrieves the return URL from the query parameters in the current 
  // window's URL, ensuring it has same origin as the current page, 
  // falls back to default logged out URL if not found
   
  getReturnUrl(state) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) ||
      fromQuery ||
      `${window.location.origin}${ApplicationPaths.LoggedOut}`;
  }

  navigateToReturnUrl(returnUrl) {
    return window.location.replace(returnUrl);
  }
}
