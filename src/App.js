import React, { Component, useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import Top from './component/Top_user/Top';
import Login from './login/Login';
import './App.css';
import Cookies from 'js-cookie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const comEmployeeRoleFromCookie = Cookies.get('comEmployeeRole');
    if (comEmployeeRoleFromCookie != null && (comEmployeeRoleFromCookie === '0' || comEmployeeRoleFromCookie === '1')) {
      // console.log("isLogin");
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [Cookies.get('comEmployeeRole')]);

  return (
    isLoggedIn ? (
      <div className="app-container">
        <Top />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    ) : (
      <Login />
    )
  )
}

export default App;