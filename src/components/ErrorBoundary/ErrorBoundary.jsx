import React from 'react';
import Errors from '../Errors/Errors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {    // Update state so the next render will show the fallback UI.    
    return { 
      hasError: true,
      errorInfo: error 
    };  
  }
  componentDidCatch(error, errorInfo) {    // You can also log the error to an error reporting service    
    this.setState = { 
      error: error,
      errorInfo: errorInfo
    }
  }
  render() {
    if (this.state.errorInfo) {      // You can render any custom fallback UI      
      return (
        <>
          <Errors 
            error={this.state.error}
            errorInfo={this.state.error}
          />
          {this.state.error.toString()}
        </>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
