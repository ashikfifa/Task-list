// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = ({ isLoggedIn, handleLogout, user }) => {

//   const [showUserDetails, setShowUserDetails] = useState(false); // Toggle for showing user details

//   const toggleUserDetails = () => {
//     setShowUserDetails((prevState) => !prevState); // Toggle user details visibility
//   };


//   return (
//     <nav className="bg-blue-500 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Title */}
//         <h1 className="text-white text-xl font-bold mx-auto text-center">
//           Task Manager
//         </h1>

//         {/* Navigation Links */}
//         {isLoggedIn ? (
//           <div className="flex space-x-4">
//             <Link
//               to="/"
//               className="text-white hover:text-gray-300 font-medium"
//             >
//               Task Form
//             </Link>
//             <Link
//               to="/tasks"
//               className="text-white hover:text-gray-300 font-medium"
//             >
//               Task List
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="flex space-x-4">
//             <Link
//               to="/login"
//               className="text-white hover:text-gray-300 font-medium"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="text-white hover:text-gray-300 font-medium"
//             >
//               Register
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout, user }) => {
  const [showUserDetails, setShowUserDetails] = useState(false); // Toggle for showing user details

  const toggleUserDetails = () => {
    setShowUserDetails((prevState) => !prevState); // Toggle user details visibility
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Title */}
        <h1 className="text-white text-xl font-bold mx-auto text-center">
          Task Manager
        </h1>

        {/* Navigation Links */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* Task Form and Task List Links */}
            <Link
              to="/"
              className="text-white hover:text-gray-300 font-medium"
            >
              Task Form
            </Link>
            <Link
              to="/tasks"
              className="text-white hover:text-gray-300 font-medium"
            >
              Task List
            </Link>

            {/* User Name Button */}
            <button
              onClick={toggleUserDetails}
              className="text-white hover:text-gray-300 font-medium"
            >
              Hello, {user ? user.name : "Guest"}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>

            {/* User Details Dropdown */}
            {showUserDetails && user && (
              <div className="absolute top-16 right-4 bg-white text-black p-4 rounded shadow-lg">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-gray-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-gray-300 font-medium"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

