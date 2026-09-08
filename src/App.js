import React, { lazy, useState, useEffect } from 'react'
import { BrowserRouter as Switch, Route, Redirect } from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import axios from 'axios'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))

export const domain = `http://114.29.239.77:1555`;
// export const domain = `https://localhost:44368`;

function App() {
  const [loggedUser, setLoggedUser] = useState([]);
  const [userAccess, setUserAccess] = useState([]);

  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedUser');
    if (storedUser) {
      setLoggedUser(storedUser);
      try {
        setLoggedUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
        setLoggedUser([]);
      }
    }
  }, []);

  useEffect(() => {
    const storedUserAccess = localStorage.getItem('userAccess');
    if (storedUserAccess) {
      try {
        setUserAccess(JSON.parse(storedUserAccess));
      } catch (error) {
        console.error('Error parsing userAccess:', error);
        setUserAccess([]);
      }
    }
  }, []);

  const handleLogin = (loggedUser, userAccess) => {
    localStorage.setItem('isLoggedIn', true);

    setLoggedUser(loggedUser);
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    setUserAccess(userAccess)
    localStorage.setItem('userAccess', JSON.stringify(userAccess));

    window.location.pathname = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');

    localStorage.removeItem('loggedUser');
    setLoggedUser([]);

    localStorage.removeItem('userAccess');
    setUserAccess([]);

    window.location.pathname = "/login";
  };

  return (
    <>
      <AccessibleNavigationAnnouncer />
      <Switch>
        {!localStorage.getItem('isLoggedIn') ? (
          <>
            <Route
              path="/login"
              render={(props) => (
                <Login {...props} handleLogin={handleLogin} />
              )}
            />
            {/* Redirect any other route to login if not logged in */}
            <Redirect to="/login" />
          </>
        ) : (
          <>
            <Route
              path="/"
              render={(props) => (
                <Layout
                  {...props}
                  loggedUser={loggedUser}
                  userAccess={userAccess}
                  handleLogout={handleLogout}
                />
              )}
            />
          </>
        )}
      </Switch>
    </>
  )
}

const isTokenExpired = (expirationTime) => {
  return Date.now() >= expirationTime;
};
// Function to generate a new token
const generateToken = async () => {
  try {
      const apiUrl =  domain + "/api/Authentication/login";
      const data = {
          userName: "admin",
          password: "password"
      };
      const response = await axios.post(apiUrl, data, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const token = response.data.token;
      const expirationTime = Date.now() + (60 * 60 * 1000); // Assuming token expires in 1 hour
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime);
      return token;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
};
// Function to get the token
export const getToken = async () => {
  const token = localStorage.getItem('token');
  const tokenExpiration = localStorage.getItem('tokenExpiration');

  if (!token || !tokenExpiration || isTokenExpired(Number(tokenExpiration))) {
      return await generateToken();
  } else {
      return token;
  }
};

// export const token = await getToken();
export const token = "";

export default App
