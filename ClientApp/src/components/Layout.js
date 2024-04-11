import { Container } from 'reactstrap';
import React, { Component } from 'react';
import { NavMenu } from './NavigationMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
