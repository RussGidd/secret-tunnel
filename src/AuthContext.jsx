import { createContext, useContext, useState, useEffect } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup(userName) {
    const response = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password: "super-secret-999",
      }),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const responseData = await response.json();
    setToken(responseData.token);
    sessionStorage.setItem("token", responseData.token);
    setLocation("TABLET");
  }

  // TODO: authenticate
  async function authenticate() {
    if (!token) {
      throw new Error("No Token Found.");
    }

    const response = await fetch(API + "/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Authentication Failed.");
    }
    setLocation("TUNNEL");
    sessionStorage.removeItem("token");
    setToken(undefined);
  }
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setLocation("TABLET");
    }
  }, []);

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
