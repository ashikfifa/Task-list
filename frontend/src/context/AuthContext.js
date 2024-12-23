import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser as loginUserAPI } from '../utils/authUtils'; // import loginUser function
import axios from 'axios';

// Create Context
export const AuthContext = createContext();

// Create a custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that will wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Store login state

  useEffect(() => {
    // Check if token exists in localStorage and fetch user details if it does
    if (token) {
      const fetchUserDetails = async () => {
        try {
          const userData = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userData.data); // Save user details to state
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false); // If no token, set loading to false
    }
  }, [token]); // Dependency on token for refetching user data

  const loginUser = async (email, password) => {
    try {
      const userData = await loginUserAPI(email, password); // Use the existing loginUser function
      setUser(userData); // Set the user details after successful login
      setToken(localStorage.getItem('authToken')); // Set token from localStorage
      setError(''); // Clear any previous errors
    } catch (err) {
      setError(err.message || 'Login failed'); // Handle login error
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setUser(null); // Clear user data
    setToken(null); // Clear token
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
