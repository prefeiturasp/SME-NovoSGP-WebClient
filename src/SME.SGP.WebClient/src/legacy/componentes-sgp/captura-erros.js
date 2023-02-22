import { Component } from 'react';
import history from '~/servicos/history';

export default class CapturaErros extends Component {
  // eslint-disable-next-line react/no-unused-state
  state = { has_error: false };

  componentDidCatch() {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ has_error: true });
    history.push('/erro');
  }

  render() {
    return this.props?.children;
  }
}
