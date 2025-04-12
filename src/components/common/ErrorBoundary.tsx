import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      );
    }

    return this.props.children;
  }
}