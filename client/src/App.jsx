import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import "./App.css";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState("login");
  const [isActive, setIsActive] = useState("login");
  console.log(token);
  console.log(isAuthenticated);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          setIsAuthenticated(true);
          setToken(savedToken);
        }
        console.log(savedToken);
      } catch (error) {
        console.log("Invalid token: ", error);
      }
    } else if (!savedToken) {
      setIsAuthenticated(false);
    }
    console.log(token);
    console.log(isAuthenticated);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
    console.log(token);
    console.log(isAuthenticated);
  }, [token]);

  const loginAuthMethod = () => {
    setAuthMethod("login");
    setIsActive("login");
  };

  const registerAuthMethod = () => {
    setAuthMethod("register");
    setIsActive("register");
  };

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
  };

  return (
    <>
      <Header token={token} onLogout={logOut} />
      <main>
        {isAuthenticated ? (
          <Dashboard token={token} />
        ) : (
          <div>
            <h3>Please Log in or Register</h3>
            <div className="auth">
              <div>
                <button
                  type="button"
                  className={
                    isActive === "login"
                      ? "active loginButton authButton"
                      : "loginButton authButton"
                  }
                  onClick={loginAuthMethod}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className={
                    isActive === "register"
                      ? "active registerButton authButton active"
                      : "registerButton authButton"
                  }
                  onClick={registerAuthMethod}
                >
                  Register
                </button>
              </div>

              {authMethod === "login" ? (
                <Login saveToken={saveToken} />
              ) : (
                authMethod === "register" && <Register saveToken={saveToken} />
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
