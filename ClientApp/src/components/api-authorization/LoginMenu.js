//
import { ApplicationPaths } from './ApiAuthorizationConstants';
import authService from './AuthorizeService';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

/* Dynamically renders navigation items based on the 
user auth status providing options for 
registration and login when user is not 
authenticated and displaying personalized greeting 
and logout link when the user is authenticated. 
Interacts with the AuthorizeService to determine 
auth state and user information */

export class LoginMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null
    };
  }

  // Fetches auth state and user info 

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user && user.name
    });
  }

  // Subscribes to changes in auth state

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  // Unsubscribes from auth state changes

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  // Renders different views based on auth state

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath = `${ApplicationPaths.LogOut}`;
      const logoutState = { local: true };
      return this.authenticatedView(userName, profilePath, logoutPath, logoutState);
    }
  }

  anonymousView(registerPath, loginPath) {
    return (<Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
      </NavItem>
    </Fragment>);
  }

  authenticatedView(userName, profilePath, logoutPath, logoutState) {
    return (<Fragment>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {userName}</NavLink>
      </NavItem>
      <NavItem>
        <NavLink replace tag={Link} className="text-dark" to={logoutPath} state={logoutState}>Logout</NavLink>
      </NavItem>
    </Fragment>);
  }


}
