import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';
import Cookies from 'js-cookie';
import App from './App';
import All from './user/All/All';
import Task from './user/Task/Task';
import Submit from './user/Submit/Submit';
import Sign from './user/Sign/Sign';
import Form_Leave from './user/Form/Form_Leave/Form_Leave';
import Form_Official from './user/Form/Form_Official/Form_Official';
import Form_Request from './user/Form/Form_Request/Form_Request';
import reportWebVitals from './reportWebVitals';
import Departments from './admin/Departments/Departments';
import Roles from './admin/Roles/Roles';
import Employees from './admin/Employees/Employees';
import Bpm from './admin/Bpm/Bpm';

const Root = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(null);

  useEffect(() => {
    const comEmployeeRoleFromCookie = Cookies.get('comEmployeeRole');
    console.log(comEmployeeRoleFromCookie);

    if (comEmployeeRoleFromCookie === '1') {
      setIsAdminLoggedIn(false);
    } else if (comEmployeeRoleFromCookie === '0') {
      setIsAdminLoggedIn(true);
    } else if (comEmployeeRoleFromCookie === undefined) {
      console.log('comEmployeeRoleFromCookie 為 undefined');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<App />}>
        {isAdminLoggedIn ? (
          <>
            <Route path="departments" element={<Departments />} />
            <Route path="roles" element={<Roles />} />
            <Route path="employees" element={<Employees />} />
            <Route path="bpm" element={<Bpm />} />
            <Route index element={<Departments />} />
          </>
        ) : (
          <>
            <Route path="all" element={<All />} />
            <Route path="task" element={<Task />} />
            <Route path="submit" element={<Submit />} />
            <Route path="sign" element={<Sign />} />
            <Route path="leave" element={<Form_Leave />} />
            <Route path="official" element={<Form_Official />} />
            <Route path="request" element={<Form_Request />} />
            <Route index element={<All />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
