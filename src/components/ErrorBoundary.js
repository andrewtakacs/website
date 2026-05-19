import React from 'react';
import NotFound from '../pages/NotFound';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <NotFound message="Sh#t!! You were so close but something crashed before it could load..." />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
