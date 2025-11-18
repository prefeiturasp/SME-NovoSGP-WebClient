import React from 'react';
export default class CapturaErros extends React.Component {
  state = { hasErrorBoundary: false };

  componentDidCatch() {
    this.setState({ has_error: true });
    this.props.navigate('/erro');
  }

  render() {
    return this.props?.children;
  }
}
