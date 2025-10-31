import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state untuk menampilkan fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error ke console atau service logging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <i className="fa-solid fa-triangle-exclamation text-danger" style={{ fontSize: '4rem' }}></i>
              </div>
              <h2 className="mb-3">Oops! Terjadi Kesalahan</h2>
              <p className="text-muted mb-4">
                Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan akan segera memperbaikinya.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <div className="alert alert-danger text-start mb-4">
                  <h6 className="fw-bold">Error Details (Development Mode):</h6>
                  <pre className="mb-0" style={{ fontSize: '0.85rem', maxHeight: '200px', overflow: 'auto' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <div className="d-flex gap-2 justify-content-center">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleReset}
                >
                  <i className="fa-solid fa-home me-2"></i>
                  Kembali ke Beranda
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  <i className="fa-solid fa-rotate-right me-2"></i>
                  Muat Ulang Halaman
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
