import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="hero-heading">404</h1>
        <p className="hero-subtitle">Page not found</p>
        <Link to="/" className="button primary lg">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;