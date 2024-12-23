
import axios from "axios";

export const loginUser = async (email, password) => {
    try {
        // Send login request to the server
        const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

        // Log the response from the server to ensure it's correct
        console.log("Login Response:", response.data);

        // Check if the token is provided in the response
        if (response.data?.token) {
            const token = response.data.token;
            console.log('token',token);
            

            // Save token in localStorage
            localStorage.setItem('authToken', token);

             // Log to confirm token is saved
             console.log("Token saved to localStorage:", localStorage.getItem('authToken'));

            // Fetch user details using the token
            try {
                const userResponse = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Log the user details response
                console.log("User details fetched:", userResponse.data);

                // Return the fetched user details
                return userResponse.data;
            } catch (error) {
                console.error('Failed to fetch user details:', error.response?.data || error.message);
                throw new Error('Failed to fetch user details');
            }
        } else {
            // Log an error if the token is not provided
            console.error('Token not provided in response');
            throw new Error('Token not provided');
        }
    } catch (error) {
        // Log the error if the login request fails
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

