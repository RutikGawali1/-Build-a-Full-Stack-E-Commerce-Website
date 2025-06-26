import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <React.Fragment>
      <div class="unauthorized-container w-100">
                <h1><i class="fas fa-exclamation-circle"></i> 404 Page Not Found.</h1>
                <br />
                <p class="text-muted">Please log in or return to the homepage.</p>
                <div class="action-buttons mt-4">
                    <Link to="/login" class="btn btn-primary me-2">Login</Link>
                    <a href="/" class="btn btn-outline-secondary">Return to Home</a>
                </div>
            </div>
    </React.Fragment>
  )
}
