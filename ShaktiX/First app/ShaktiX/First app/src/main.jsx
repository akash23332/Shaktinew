import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./tailwind.css";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);