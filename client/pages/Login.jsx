import React, { Component } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import MainContainer from './containers/MainContainer';
import axios from 'axios';
import Logo from '../components/Logo.jsx';
import '../styles/LoginTwo.scss';
// import SignUp from './SignUp.jsx';

/*
  Need for login page:
    header -> TeamFinder
    Username -> submit form
    Password -> submit form
    Submit Button
    Link -> Sign-up
*/

const LoginTwo = () => {
  // This hook will change state if the user's input is invalid
  // const [valid, setValid] = useState(true);
  // This hook will change our password's type to password
  // const [hide, setHide] = useState(true);
  const [username, setInputUsername] = useState('');
  const [password, setInputPassword] = useState('');
  const [authResponse, setAuthResponse] = useState(false);
  // Create a hook that handles input changes for either username or password
  // const initialInputState = {
  //   username: '',
  //   password: '',
  // };
  // we want to useNavigate as a side effect of successful login
  const navigate = useNavigate();
  // const hidePW = () => setHide((prevState) => !prevState);
  // This hook will change state depending on the user's inputs
  // const [inputData, setInputData] = useState(initialInputState);
  // create a handle input change function
  // const handleInputChange = (e, inputId) => {
  //   return setInputData((prevState) => ({
  //     ...prevState,
  //     [inputId]: e.target.value,
  //   }));
  // Clear localStorage in login
  // useEffect(() => {
  //   localStorage.clear();
  // }, []);
  // create a handle submit function
  const handleSubmit = (event) => {
    // prevent a page referesh
    event.preventDefault();
    // do a check on the input types
    if (!username || !password) return;
    // Send an asynchronous post request to our server, which should handle logging in
    (async function loginUser() {
      try {
        await axios
          .post('http://localhost:3000/user/login', 
            {username:username, password:password}
          )
          .then((response) => {
            localStorage.setItem('username', username);
            localStorage.setItem('user_id', response.data.id);
            if(!response.data.auth) {
              setAuthResponse(false);
            }
            else {
              console.log(response.data);
              localStorage.setItem('token', response.data.token);
              setAuthResponse(true);
              return;
            }
            // setValid(false);
            // setInputData(initialInputState);
            // return response.data;
          })
          .then(() => {
            return navigate('/home');
          });
      } catch (err) {
        alert('Incorrect username or password!');
      }
    })();
  };

  const checkAuthentication = () => {
    axios.get('http://localhost:3000/user/auth', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
      },
    }).then((response) => {
      console.log(response);
    });
  };


  return (
    <main className="login">
      <div className="svg-top">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="1337"
          height="1337"
        >
          <defs>
            <path
              id="path-1"
              fillRule="evenodd"
              d="M1337 668.5c0 368.955-299.545 668.5-668.5 668.5-144.827 0-331.5-101-298-243C434.038 824.673 0 892.628 0 668.5 0 299.545 299.545 0 668.5 0S1337 299.545 1337 668.5z"
              opacity="1"
            ></path>
            <linearGradient
              id="linearGradient-2"
              x1="0.79"
              x2="0.21"
              y1="0.62"
              y2="0.86"
            >
              <stop
                offset="0"
                stopColor="#583ED5"
              ></stop>
              <stop
                offset="1"
                stopColor="#17D7FA"
              ></stop>
            </linearGradient>
          </defs>
          <use
            fill="url(#linearGradient-2)"
            xlinkHref="#path-1"
          ></use>
        </svg>
      </div>
      <div className="svg-bottom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="967.885"
          height="896"
        >
          <defs>
            <path
              id="path-2"
              fillRule="evenodd"
              d="M896 448c246.633 17.575-200.742 448-448 448S0 695.258 0 448 200.742 0 448 0s27 418 448 448z"
              opacity="1"
            ></path>
            <linearGradient
              id="linearGradient-3"
              x1="0.5"
              x2="0.5"
              y1="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="#28AFF0"
              ></stop>
              <stop
                offset="1"
                stopColor="#120FC4"
              ></stop>
            </linearGradient>
          </defs>
          <use
            fill="url(#linearGradient-3)"
            xlinkHref="#path-2"
          ></use>
        </svg>
      </div>

      <section className="container">
        <section className="wrapper">
          <header>
            <div className="logo">
              <span>
                <Logo />
              </span>
            </div>
            <h1>Pitch It</h1>
            {authResponse && 
      <button className = "authButton" onClick = {checkAuthentication}>Check Authentication</button>
            }
          </header>
          <section className="main-content">
            <form
              action=""
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Username"
                // value={inputData.username}
                onChange={(e) => setInputUsername(e.target.value)}
              />
              <div className="line"></div>
              <input
                type="password"
                placeholder="Password"
                // value={inputData.password}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              <button type="submit">Login</button>
              {/* Conditionally render an error message if the user input is invalid */}
              {/* {!valid && (
                <span className="input-error">
                  Please enter a valid username and password
                </span>
              )} */}
            </form>
          </section>
          <footer>
            <p>
              <a
                href=""
                title="Register"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </a>
            </p>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default LoginTwo;
