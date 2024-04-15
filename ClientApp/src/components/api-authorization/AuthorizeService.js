//
import { ApplicationPaths, ApplicationName } from './ApiAuthorizationConstants';
import { UserManager, WebStorageStateStore } from 'oidc-client';

export class AuthorizeService {
  _callbacks = [];
  _nextSubscriptionId = 0;
  _user = null;
  _isAuthenticated = false;

  /* Handles authentication-related tasks using OpenID 
  Connect, checking user authentication status, signing in and out users, 
  and managing subscriptions to authentication events */

  _popUpDisabled = true;

  // Retrieves user profile after ensuring user manager is initialized

  async getUser() {
    if (this._user && this._user.profile) {
      return this._user.profile;
    }
    await this.ensureUserManagerInitialized();
    const user = await this.userManager.getUser();
    return user && user.profile;
  }

  // Checks if user is authenticated 

  async isAuthenticated() {
    const user = await this.getUser();
    return !!user;
  }

  // Retrieves access token from user profile 

  async getAccessToken() {
    await this.ensureUserManagerInitialized();
    const user = await this.userManager.getUser();
    return user && user.access_token;
  }

  // Attempts to authenticate user silently, via a pop-up window, 
  // or through redirect

  async signIn(state) {
    await this.ensureUserManagerInitialized();
    try {
      const silentUser = await this.userManager.signinSilent(this.createArguments());
      this.updateState(silentUser);
      return this.success(state);
    } catch (silentError) {
      console.log("Silent authentication error: ", silentError);

      try {
        if (this._popUpDisabled) {
          throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
        }

        const popUpUser = await this.userManager.signinPopup(this.createArguments());
        this.updateState(popUpUser);
        return this.success(state);
      } catch (popUpError) {
        if (popUpError.message === "Popup window closed") {
          return this.error("The user closed the window.");
        } else if (!this._popUpDisabled) {
          console.log("Popup authentication error: ", popUpError);
        }

       
        try {
          await this.userManager.signinRedirect(this.createArguments(state));
          return this.redirect();
        } catch (redirectError) {
          console.log("Redirect authentication error: ", redirectError);
          return this.error(redirectError);
        }
      }
    }
  }

// Finalizes user sign-in by handling the callback URL, 
// updating user state, and returning the authentication result

  async completeSignIn(url) {
    try {
      await this.ensureUserManagerInitialized();
      const user = await this.userManager.signinCallback(url);
      this.updateState(user);
      return this.success(user && user.state);
    } catch (error) {
      return this.error('There was an error signing in');
    }
  }

  // Initiates user sign-out process, handling both popup and 
  // redirect sign-out methods and updating user state 

  async signOut(state) {
    await this.ensureUserManagerInitialized();
    try {
      if (this._popUpDisabled) {
        throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
      }

      await this.userManager.signoutPopup(this.createArguments());
      this.updateState(undefined);
      return this.success(state);
    } catch (popupSignOutError) {
      console.log("Popup signout error: ", popupSignOutError);
      try {
        await this.userManager.signoutRedirect(this.createArguments(state));
        return this.redirect();
      } catch (redirectSignOutError) {
        console.log("Redirect signout error: ", redirectSignOutError);
        return this.error(redirectSignOutError);
      }
    }
  }

  async completeSignOut(url) {
    await this.ensureUserManagerInitialized();
    try {
      const response = await this.userManager.signoutCallback(url);
      this.updateState(null);
      return this.success(response && response.data);
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`);
      return this.error(error);
    }
  }

  // Updates internal user state, determines if user is authenticated 
  // notifies subscribers of the authentication state change
  
  updateState(user) {
    this._user = user;
    this._isAuthenticated = !!this._user;
    this.notifySubscribers();
  }

  // Adding/removing a callback function to the list of subscribers 

  subscribe(callback) {
    this._callbacks.push({ callback, subscription: this._nextSubscriptionId++ });
    return this._nextSubscriptionId - 1;
  }
  unsubscribe(subscriptionId) {
    const subscriptionIndex = this._callbacks
      .map((element, index) => element.subscription === subscriptionId ? { found: true, index } : { found: false })
      .filter(element => element.found === true);
    if (subscriptionIndex.length !== 1) {
      throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
    }

    this._callbacks.splice(subscriptionIndex[0].index, 1);
  }

  // Iterates through all subscribed callbacks and invokes them

  notifySubscribers() {
    for (let i = 0; i < this._callbacks.length; i++) {
      const callback = this._callbacks[i].callback;
      callback();
    }
  }

  // Constructs object with properties for navigation, 
  // used during authentication

  createArguments(state) {
    return { useReplaceToNavigate: true, data: state };
  }

  // Failed/success authentication attempt

  error(message) {
    return { status: AuthenticationResultStatus.Fail, message };
  }
  success(state) {
    return { status: AuthenticationResultStatus.Success, state };
  }

// Returns an object indicating redirection is necessary 
// for auth

  redirect() {
    return { status: AuthenticationResultStatus.Redirect };
  }

  // Ensures that user manager is initialized with 
  // appropriate settings for authentication
  
  async ensureUserManagerInitialized() {
    if (this.userManager !== undefined) {
      return;
    }
    let response = await fetch(ApplicationPaths.ApiAuthorizationClientConfigurationUrl);
    if (!response.ok) {
      throw new Error(`Could not load settings for '${ApplicationName}'`);
    }
    let settings = await response.json();
    settings.automaticSilentRenew = true;
    settings.includeIdTokenInSilentRenew = true;
    settings.userStore = new WebStorageStateStore({
      prefix: ApplicationName
    });
    this.userManager = new UserManager(settings);
    this.userManager.events.addUserSignedOut(async () => {
      await this.userManager.removeUser();
      this.updateState(undefined);
    });
  }

  static get instance() { return authService }
}

const authService = new AuthorizeService();

export default authService;

export const AuthenticationResultStatus = {
  Success: 'success',
  Redirect: 'redirect',
  Fail: 'fail'
};
