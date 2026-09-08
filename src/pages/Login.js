import React, { useState, useCallback, useEffect } from 'react'
import { 
  LoadingScreen,
  Notification,
} from '../components/CustomCommon'
import ImageLight from '../assets/img/login.jpg'
import ImageDark from '../assets/img/login.jpg'
import { Label, Input, Button } from '@windmill/react-ui'
import { domain } from '../App'
import axios from 'axios'

function Login({handleLogin}) {
  const [loading, setLoading] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({
      type,
      message: message,
    });
    setTimeout(() => setNotification(null), 3000); // Auto close after 3 seconds
  };

  const apiUrl =  domain + "/api/Authentication/login";
  const apiUrlUser =  domain + "/api/Users";
  const apiUrlAccessTemplate =  domain + "/api/AccessTemplates";

  const getUser = useCallback(async (token, id) => {
    try {
        const response = await axios.get(`${apiUrlUser}/${id}` , {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
  }, [apiUrlUser]);

  const getAccessTemplate = useCallback(async (token, id) => {
    try {
        const response = await axios.get(`${apiUrlAccessTemplate}/${id}` , {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
  }, [apiUrlAccessTemplate]);

  const loginHandleClick = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    if(!username || !password){
      showNotification("fail", "Please input username and password.")
      setLoading(false);
      return;
    }

    const data = {
      username: username,
      password: password
    };

    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // localStorage.setItem('token', response.data.token);

        const loggedUser = await getUser(response.data.token, response.data.account.userId)
        const userAccess = await getAccessTemplate(response.data.token, response.data.account.accessTemplateId)

        await handleLogin(loggedUser, userAccess);
        showNotification("success", "Logged In Successfully")
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = "An error occurred"; // Default error message
    
        if (error.response) {
            // Check if the response data contains a specific message
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data) {
                // If there's any other data in the response, use it
                errorMessage = error.response.data;
            }
        }

        showNotification("fail", errorMessage)
    } finally {
      setLoading(false);
    }
  }, [apiUrl, getAccessTemplate, getUser, handleLogin, password, username]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        loginHandleClick(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loginHandleClick]);

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden bg-gray-200"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block bg-gray-600"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
                <Label>
                  <span>Username</span>
                  <Input className="mt-1" type="email" placeholder="User@12345" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                </Label>

                <Label className="mt-4">
                  <span>Password</span>
                  <Input className="mt-1" type="password" placeholder="***************"  value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </Label>

                <Button className="mt-4" block onClick={loginHandleClick}>
                  Log in
                </Button>

                <hr className="my-8" />
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  )
}

export default Login
