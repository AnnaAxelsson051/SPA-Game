//
import { Component } from 'react'
import { ApplicationPaths, QueryParameterNames } from './ApiAuthorizationConstants'
import React from 'react'
import authService from './AuthorizeService'
import { Navigate } from 'react-router-dom'

/* Manages route authorization by checking the user's 
authentication status using an AuthorizeService. 
It renders the provided element if the user is 
authenticated; otherwise, it redirects to the login 
page with a return URL to maintain routing integrity. */

export default class AuthorizeRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      authenticated: false
    };
  }

  //subscribes to authentication changes using authService 
  //and populates the authentication state when the component mounts
  componentDidMount() {
    this._subscription = authService.subscribe(() => this.authenticationChanged());
    this.populateAuthenticationState();
  }

  //unsubscribes the component from authentication events
  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  //creates a redirect URL to the login page with a return URL 
  //parameter if the user is not authenticated, or renders the 
  //provided element if the user is authenticated
  render() {
    const { ready, authenticated } = this.state;
    var link = document.createElement("a");
    link.href = this.props.path;
    const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
    if (!ready) {
      return <div></div>;
    } else {
      const { element } = this.props;
      return authenticated ? element : <Navigate replace to={redirectUrl} />;
    }
  }

  //checks if the user is authenticated 
  //and updates the component state accordingly
  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated();
    this.setState({ ready: true, authenticated });
  }

  //updates the component state to indicate that authentication 
  //status is not ready and not authenticated, then async
  //updates the authentication state
  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false });
    await this.populateAuthenticationState();
  }
}
