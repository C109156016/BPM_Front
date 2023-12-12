import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import '../App.css';
import { Button, Checkbox, Form, Input } from 'antd';
import Cookies from 'js-cookie';
import logo from '../component/Top_user/Logo.png';
import LoadingScreen from './LoadingScreen';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comEmployeeEmail, setEmail] = useState("");
  const [comEmployeePwd, setPwd] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const EmailOnchange = (event) => {
    setEmail(event.target.value);
  };

  const PwdOnchange = (event) => {
    setPwd(event.target.value);
  };

  
  const onSubmit = () => {
    setIsLoading(true);
  
    socket.emit('login', [comEmployeeEmail, comEmployeePwd]);
    socket.on('response', data => {
      // console.log("Setting cookie with value:", data[0]);
      Cookies.set('comEmployeeRole', data[6], { expires: 1, path: '/' });
      const employeeIdFromLogin = data[0];
      const employeeNameFromLogin = data[1];
      const departmentIdFromLogin = data[2];
      const roleIdFromLogin = data[3];

    //這邊我有多加兩個變數存departmentid、roleid給別的地方用
      Cookies.set('comEmployeeId', employeeIdFromLogin, { expires: 1, path: '/' });
      Cookies.set('comEmployeeName', employeeNameFromLogin, { expires: 1, path: '/' });
      Cookies.set('comDepartmentId', departmentIdFromLogin, { expires: 1, path: '/' });
      Cookies.set('comRoleId', roleIdFromLogin, { expires: 1, path: '/' });

      if (data[6] === 0 || data[6] === 1) {
        setIsLoggedIn(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };
  
  return (
    isLoggedIn ? (<LoadingScreen />) : (
      <div className='form-background'>
        <img src={logo} alt="Logo" />
        <Form
          layout="vertical"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="帳號(電子郵件)"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input onChange={EmailOnchange} value={comEmployeeEmail} />
          </Form.Item>

          <Form.Item
            label="密碼"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password onChange={PwdOnchange} value={comEmployeePwd} />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>記住密碼</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={onSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  )
}

export default Login;