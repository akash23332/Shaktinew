import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f4f6",
};

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: 16, fontSize: 40, fontWeight: 700 }}>404</h1>
        <p style={{ marginBottom: 16, fontSize: 18, color: "#64748b" }}>Oops! Page not found</p>
        <a href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
