import React from "react";
import Errors from "../Errors/Errors";
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: !!error,
      errorInfo: error,
    };
  }
  componentDidCatch(error, errorInfo) {
    // TODO: log the error to an error reporting service
    this.setState({
      hasError: !!error,
      error: error,
      errorInfo: errorInfo,
    });
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className={`errorWrapper ${this.props?.customClass}`}>
          <Errors
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            positionAbsolute={!!this.props.positionAbsolute}
          />
          <button
            type="button"
            onClick={this.resetErrorBoundary}
            style={this.props.positionAbsolute && { position: 'absolute' }}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
