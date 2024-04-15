//
import React from 'react'
import { LoginActions, QueryParameterNames, ApplicationPaths } from './ApiAuthorizationConstants';
import { AuthenticationResultStatus } from './AuthorizeService';
import { Component } from 'react';
import authService from './AuthorizeService';

/* Manages user login functionality based on 
actions such as login, login callback processing, 
login failure handling, profile access, and registration
 redirection. Interacts with AuthorizeService to 
 handle authentication tasks and redirects users 
 appropriately based on their actions and auth results */

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: undefined
    };
  }

  // Checks the action prop, depending on action type, 
  // executes different auth rel tasks

  componentDidMount() {
    const action = this.props.action;
    switch (action) {
      case LoginActions.Login:
        this.login(this.getReturnUrl());
        break;
      case LoginActions.LoginCallback:
        this.processLoginCallback();
        break;
      case LoginActions.LoginFailed:
        const params = new URLSearchParams(window.location.search);
        const error = params.get(QueryParameterNames.Message);
        this.setState({ message: error });
        break;
      case LoginActions.Profile:
        this.redirectToProfile();
        break;
      case LoginActions.Register:
        this.redirectToRegister();
        break;
      default:
        throw new Error(`Invalid action '${action}'`);
    }
  }

  // Checks the action prop to determine what UI content to render 

  render() {
    const action = this.props.action;
    const { message } = this.state;

    if (!!message) {
      return <div>{message}</div>
    } else {
      switch (action) {
        case LoginActions.Login:
          return (<div>Processing login</div>);
        case LoginActions.LoginCallback:
          return (<div>Processing login callback</div>);
        case LoginActions.Profile:
        case LoginActions.Register:
          return (<div></div>);
        default:
          throw new Error(`Invalid action '${action}'`);
      }
    }
  }

  // Initiates the auth process 

  async login(returnUrl) {
    const state = { returnUrl };
    const result = await authService.signIn(state);
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
        throw new Error(`Invalid status result ${result.status}.`);
    }
  }

  // Processes the auth callback 

  async processLoginCallback() {
    const url = window.location.href;
    const result = await authService.completeSignIn(url);
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
        throw new Error(`Invalid authentication result status '${result.status}'.`);
    }
  }

  // Retrieves the return URL from the query parameters of the current URL
  // If no return URL is provided defaults to current page origin

  getReturnUrl(state) {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
      throw new Error("This return url is not valid.")
    }
    return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
  }

  redirectToRegister() {
    this.redirectToApiAuthorizationPath(`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`);
  }

  redirectToProfile() {
    this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);
  }

  redirectToApiAuthorizationPath(apiAuthorizationPath) {
    const redirectUrl = `${window.location.origin}/${apiAuthorizationPath}`;
    window.location.replace(redirectUrl);
  }

  navigateToReturnUrl(returnUrl) {
    window.location.replace(returnUrl);
  }
}
