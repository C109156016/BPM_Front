import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Top.css';
import logo from './Logo.png';
import Cookies from 'js-cookie';

import {
  DownOutlined,
  UserOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

import {
  Button,
  Menu,
  Dropdown,
  Space
} from 'antd';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const admin = [
  getItem(<Link to="departments">部門群組</Link>, '1', <PieChartOutlined />),
  getItem(<Link to="roles">職位角色</Link>, '2', <DesktopOutlined />),
  getItem(<Link to="employees">員工</Link>, '3', <ContainerOutlined />),
  getItem(<Link to="bpm">流程管理</Link>, '4', <MailOutlined />),
];

const user = [
  getItem(<Link to="all">我的表單</Link>, '1', <PieChartOutlined />),
  getItem(<Link to="task">我的待辦</Link>, '2', <DesktopOutlined />),
  getItem(<Link to="submit">已提交</Link>, '3', <ContainerOutlined />),
  getItem(<Link to="sign">已簽核</Link>, '4', <MailOutlined />),
  getItem('流程申請', 'sub', <AppstoreOutlined />, [
    getItem('差勤表單', 'sub1', null, [getItem(<Link to="leave">請假單</Link>, '5'), getItem(<Link to="Official">公出單</Link>, '6')]),
    getItem('請購及費用補助類', 'sub2', null, [getItem(<Link to="request">請款單</Link>, '7')]),
  ]),

  //User的
];


function Top() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdminLoggedIn, setAdminLoggedIn] = useState(false);
  const [comEmployeeNameFromCookie, setComEmployeeNameFromCookie] = useState('');

  const navigate = useNavigate();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const goToHomePage = () => {
    navigate('/');
    Cookies.remove('comEmployeeRole');
  };

  const roles = [
    {
      label: <a href="" onClick={goToHomePage}>登出</a>,
      key: '3',
    },
  ];

  useEffect(() => {
    const comEmployeeNameFromCookie = Cookies.get('comEmployeeName');
    console.log(comEmployeeNameFromCookie);
    setComEmployeeNameFromCookie(comEmployeeNameFromCookie);

    const comEmployeeRoleFromCookie = Cookies.get('comEmployeeRole');
    if (comEmployeeRoleFromCookie === '0') {
      setAdminLoggedIn(true);
    }
  }, []);


  return (
    isAdminLoggedIn ? (
      <div className='flex'>
        <header>
          <div className='navbar'>
            <Button
              type="primary"
              onClick={toggleCollapsed}
              className='sidebar_btn'
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <img src={logo} alt="Logo" />
          </div>
          <Dropdown
            menu={{
              items: roles
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className='space'>
                <UserOutlined className="icon" />
                <span className="username">{comEmployeeNameFromCookie}</span>
                <DownOutlined className="icon" />
              </Space>
            </a>
          </Dropdown>
        </header>
        <div
          style={{
            width: 256,
          }}
        >
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            items={admin}
            className='sidebar'
          />
        </div>
      </div>
    ) : (
      <div className='flex'>
        <header>
          <div className='navbar'>
            <Button
              type="primary"
              onClick={toggleCollapsed}
              className='sidebar_btn'
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <img src={logo} alt="Logo" />
          </div>
          <Dropdown
            menu={{
              items: roles
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className='space'>
                <UserOutlined className="icon" />
                <span className="username">{comEmployeeNameFromCookie}</span>
                <DownOutlined className="icon" />
              </Space>
            </a>
          </Dropdown>
        </header>
        <div
          style={{
            width: 256,
          }}
        >
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            inlineCollapsed={collapsed}
            items={user}
            className='sidebar'
          />
        </div>
      </div>
    )

  );
}

export default Top;
