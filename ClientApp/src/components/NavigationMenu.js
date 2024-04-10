//
import React, { Component } from 'react';
import './NavigationMenu.css';
import { Link } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';

export class NavigationMenu extends Component {
    static displayName = NavigationMenu.name;

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm ng-white border-bottom navbar-toggleable-sm" container light>
                    <NavbarBrand tag={Link} to="/">Guessing Game &nbsp; ˚˖𓍢ִ໋🌷͙֒✧˚.🎀༘⋆</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
                    <Collapse className="flex-sm-row-reverse d-sm-inline-flex" isOpen={!this.state.collapsed} navbar>
                        <ul className="navbar-nav flex-grow">
                        <NavItem>
                                <NavLink tag={Link} to="/">Home &nbsp;&nbsp;🏠</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/profile">Profile &nbsp;&nbsp;👤</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/play">Play &nbsp;&nbsp;▶️</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to="/toplist">Top List &nbsp;&nbsp;🏆 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</NavLink>
                            </NavItem>
                            <LoginMenu>
                            </LoginMenu>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
