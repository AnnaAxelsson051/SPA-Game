

import './custom.css';
import { Layout } from './components/Layout';
import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';


export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Routes>
      
        </Routes>
      </Layout>
    );
  }
}
