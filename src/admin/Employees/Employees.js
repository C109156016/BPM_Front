import React, { Component, useRef, useState, useEffect } from 'react'
import Highlighter from 'react-highlight-words';
import './Employees.css';
import io from 'socket.io-client';
import LoadingScreen from '../../login/LoadingScreen'
import '../../login/LoadingScreen.css'

import {
  HomeOutlined,
  ContainerOutlined,
  SearchOutlined,
  EditOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import {
  Breadcrumb,
  Button,
  Input,
  Space,
  Table,
  Drawer,
  Divider,
  Select,
  Switch,
  notification
} from 'antd';

function Employees() {

  const [socket, setSocket] = useState(null);
  const [EmployeesData, setEmployeesData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [RolesData, setRolesData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchedEmployeeData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    // console.log('Emitting fetchedEmployeeData');
    newSocket.emit('fetchedEmployeeData');

    newSocket.on('employeeData', (data) => {
      setEmployeesData(data);
    });

    newSocket.on('error', (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  };

  const fetchedData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    // console.log('Emitting fetchedData');
    newSocket.emit('fetchedData');

    newSocket.on('departmentsData', (data) => {
      setDepartmentData(data);
    });

    newSocket.on('error', (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  };

  const fetchedRolesData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    // console.log('Emitting fetchedRolesData');
    newSocket.emit('fetchedRolesData');

    newSocket.on('RolesData', (data) => {
      // console.log(data);
      setRolesData(data);
    });

    newSocket.on('error', (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  };


  useEffect(() => {
    fetchedEmployeeData();
  }, []);

  useEffect(() => {
    fetchedData();
  }, []);

  useEffect(() => {
    fetchedRolesData();
  }, []);


  const [open, setOpen] = useState(false);
  const [opennew, setOpenNew] = useState(false);
  const [size, setSize] = useState();
  //新增員工
  const [comEmployeeId, setId] = useState();
  const [comEmployeeName, setName] = useState();
  const [comEmployeeEmail, setEmail] = useState();
  const [comEmployeePwd, setPwd] = useState();
  const [comRoleId, setRoleId] = useState();
  const [comDepartmentId, setDepartmentId] = useState();
  const [comLimit, setLimit] = useState('0');
  const [comUpdate, setUpdate] = useState();

  // 編輯員工
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editcomEmployeeId, seteditId] = useState();
  const [editcomEmployeeName, seteditName] = useState();
  const [editcomEmployeeEmail, seteditEmail] = useState();
  const [editcomEmployeePwd, seteditPwd] = useState();
  const [editcomRoleId, seteditRoleId] = useState();
  const [editcomDepartmentId, seteditDepartmentId] = useState();
  const [editcomLimit, seteditLimit] = useState();
  const [editcomUpdate, seteditUpdate] = useState();

  //新增
  const IdOnchange = (event) => {
    setId(event.target.value);
  };

  const NameOnchange = (event) => {
    setName(event.target.value);
  };

  const EmailOnchange = (event) => {
    setEmail(event.target.value);
  };

  const PwdOnchange = (event) => {
    setPwd(event.target.value);
  };

  const RoleIdOnchange = (value) => {
    setRoleId(value);
  };

  const DepartmentIdOnchange = (value) => {
    setDepartmentId(value);
  };

  const LimitOnchange = (checked) => {
    setLimit(checked ? '0' : '1');
    console.log(checked);
    console.log(comLimit);
  };

  const UpdateOnchange = (event) => {
    setUpdate(event.target.value);
  };

  // 編輯
  const EditIdOnchange = (event) => {
    seteditId(event.target.value);
  };

  const EditNameOnchange = (event) => {
    seteditName(event.target.value);
  };

  const EditEmailOnchange = (event) => {
    seteditEmail(event.target.value);
  };

  const EditPwdOnchange = (event) => {
    seteditPwd(event.target.value);
  };

  const EditRoleIdOnchange = (value) => {
    seteditRoleId(value);
  };

  const EditDepartmentIdOnchange = (value) => {
    seteditDepartmentId(value);
  };

  const EditLimitOnchange = (checked) => {
    seteditLimit(checked ? '0' : '1');
    console.log(checked);
    console.log(comLimit);
  };

  const EditUpdateOnchange = (event) => {
    seteditUpdate(event.target.value);
  };

  //編輯視窗
  const showLargeDrawer = (record) => {
    setSelectedRowData(record);
    seteditId(record.employee_id);
    seteditName(record.employee_name);
    seteditEmail(record.employee_email);
    seteditPwd(record.employee_password);
    seteditRoleId(record.role_id);
    seteditDepartmentId(record.department_id);
    seteditLimit(record.employee_role);
    seteditUpdate(record.employee_update);
    setSize('large');
    setOpen(true);
    console.log(record);
  };


  // 新增視窗
  const showNewDrawer = () => {
    setSize('large');
    setOpenNew(true);
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    });
  };

  const onClose = () => {
    setOpen(false);
    setOpenNew(false);
    setId();
    setName();
    setEmail();
    setPwd();
    setRoleId();
    setDepartmentId();
    setLimit();
    setUpdate();
    api.warning({
      message: '視窗關閉',
      description: '點擊 "X" 按鈕關閉提示訊息',
    });
  };

  //新增
  const handleAdd = () => {
    if (!comEmployeeName || !comEmployeeEmail || !comEmployeePwd || !comRoleId || !comDepartmentId || !comLimit) {
      api.error({
        message: '新增失敗',
        description: '請檢查欄位是否有空值及填寫錯誤',
      });
    } else {
      socket.emit('addComEmployeeData', [comEmployeeName, comEmployeeEmail, comEmployeePwd, comRoleId, comDepartmentId, comLimit, comUpdate]);
      setOpenNew(false);
      api.success({
        message: '新增成功',
        description: '部門新增成功',
      });
      setTimeout(() => {
        setIsLoading(true);
        window.location.reload();
      }, 1000);
    }
  }

  //編輯
  const handleUpdate = (editcomEmployeeId, editcomEmployeeName, editcomEmployeeEmail, editcomEmployeePwd, editcomRoleId, editcomDepartmentId, editcomLimit, editcomUpdate) => {
    socket.emit('updateEmployeeData', {
      employee_id: editcomEmployeeId,
      new_employee_name: editcomEmployeeName,
      new_employee_email: editcomEmployeeEmail,
      new_employee_password: editcomEmployeePwd,
      new_role_id: editcomRoleId,
      new_department_id: editcomDepartmentId,
      new_employee_role: editcomLimit,
      employee_update: editcomUpdate,
    });
    setOpen(false);
    setTimeout(() => {
      setIsLoading(true);
      window.location.reload();
    }, 1000);
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: '員工編號',
      dataIndex: 'employee_id',
      key: 'employee_id',
      ...getColumnSearchProps('employee_id'),
      sorter: (a, b) => a.employee_id.length - b.employee_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '員工名稱',
      dataIndex: 'employee_name',
      key: 'employee_name',
      ...getColumnSearchProps('employee_name'),
      sorter: (a, b) => a.employee_name.length - b.employee_name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '員工部門',
      dataIndex: 'department_id',
      key: 'department_id',
      ...getColumnSearchProps('department_id'),
      sorter: (a, b) => a.department_id.length - b.department_id.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const departmentInfo = departmentData.find(dep => dep.department_id === text);
        return departmentInfo ? departmentInfo.department_name : '無所屬部門';
      },
    },
    {
      title: '職位編號',
      dataIndex: 'role_id',
      key: 'role_id',
      ...getColumnSearchProps('role_id'),
      sorter: (a, b) => a.role_id.length - b.role_id.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const roleInfo = RolesData.find(role => role.role_id === text);
        return roleInfo ? roleInfo.role_name : '無所屬職位';
      },
    },
    {
      title: '員工信箱(帳號)',
      dataIndex: 'employee_email',
      key: 'employee_email',
      ...getColumnSearchProps('employee_email'),
      sorter: (a, b) => a.employee_email.length - b.employee_email.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '員工密碼',
      dataIndex: 'employee_password',
      key: 'employee_password',
      ...getColumnSearchProps('employee_password'),
      sorter: (a, b) => a.employee_password.length - b.employee_password.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '帳號權限(0 admin/1 user)',
      dataIndex: 'employee_role',
      key: 'employee_role',
      ...getColumnSearchProps('employee_role'),
      sorter: (a, b) => a.employee_role.length - b.employee_role.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        return text === 0 ? 'admin' : text === 1 ? 'user' : text;
      },
    },

    {
      title: '更新時間',
      dataIndex: 'employee_update',
      key: 'employee_update',
      ...getColumnSearchProps('employee_update'),
    },
    {
      title: '詳細內容',
      key: 'details',
      render: (text, record) => (
        <Space>
          <Button type="dashed" onClick={() => showLargeDrawer(record)} shape="circle" icon={<EditOutlined />}>
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div>
      {isLoading ? <LoadingScreen /> : (
        <>
          <div>
            <Space className='space'>
              <Breadcrumb
                items={[
                  {
                    path: '/',
                    title: (
                      <>
                        <HomeOutlined />
                        <span>首頁</span>
                      </>
                    ),
                  },
                  {
                    title: (
                      <>
                        <ContainerOutlined />
                        <span>員工</span>
                      </>
                    ),
                  },
                ]}
              />
              <Button type="dashed" icon={<PlusOutlined />} onClick={showNewDrawer}>
                新增員工
              </Button>
            </Space>
            <Table columns={columns} dataSource={EmployeesData} className='table-margin' />
            <>
              <Drawer
                title={selectedRowData ? `編輯員工-${selectedRowData.employee_name}` : `編輯部門-${comEmployeeName}`}
                placement="right"
                size={size}
                onClose={onClose}
                open={open}
                width={450}
                extra={
                  <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => {
                      handleUpdate(editcomEmployeeId, editcomEmployeeName, editcomEmployeeEmail, editcomEmployeePwd, editcomRoleId, editcomDepartmentId, editcomLimit, editcomUpdate);
                    }}>
                      OK
                    </Button>
                  </Space>
                }
              >
                <Divider orientation="left" >員工資訊</Divider>
                <div className='column'>
                  <p>員工編號</p><Input style={{ width: 250 }} onChange={EditIdOnchange} value={editcomEmployeeId} />
                  <p>員工名稱</p><Input style={{ width: 250 }} onChange={EditNameOnchange} value={editcomEmployeeName} />
                  <p>電子郵件(帳號)</p><Input style={{ width: 250 }} onChange={EditEmailOnchange} value={editcomEmployeeEmail} />
                  <p>密碼</p><Input style={{ width: 250 }} onChange={EditPwdOnchange} value={editcomEmployeePwd} />
                </div>

                <Divider orientation="left" >員工部門</Divider>
                <div className='column'>
                  <p>部門名稱</p>
                  <Select
                    showSearch
                    defaultValue="請選擇部門"
                    value={editcomDepartmentId}
                    style={{ width: 250 }}
                    onChange={EditDepartmentIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {departmentData.map((department) => (
                      <Select.Option key={department.department_id} value={department.department_id}>
                        {department.department_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <Divider orientation="left" >員工職位</Divider>
                <div className='column'>
                  <p>職位名稱</p>
                  <Select
                    showSearch
                    defaultValue="請選擇職位"
                    value={editcomRoleId}
                    style={{ width: 250 }}
                    onChange={EditRoleIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {RolesData
                      .filter((role) => role.department_id == editcomDepartmentId)
                      .map((role) => (
                        <Select.Option key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </Select.Option>
                      ))}
                  </Select>
                </div>
                <Divider orientation="left" >員工權限</Divider>
                <div className='column'>
                  <p>權限類別</p>
                  <Switch style={{ width: 150 }} checkedChildren="使用者(user)" unCheckedChildren="管理者(Admin)" defaultChecked={editcomLimit === "0"} onChange={EditLimitOnchange} />
                </div>
              </Drawer>

              {/* 新增員工 */}
              {contextHolder}
              <Drawer
                title={'新增員工'}
                placement="right"
                size={size}
                onClose={onClose}
                open={opennew}
                width={450}
                extra={
                  <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={handleAdd}>
                      OK
                    </Button>
                  </Space>
                }
              >
                <Divider orientation="left" >員工資訊</Divider>
                <div className='column'>
                  <p>員工名稱</p><Input style={{ width: 250 }} onChange={NameOnchange} value={comEmployeeName} />
                  <p>電子郵件(帳號)</p><Input style={{ width: 250 }} onChange={EmailOnchange} value={comEmployeeEmail} />
                  <p>密碼</p><Input style={{ width: 250 }} onChange={PwdOnchange} value={comEmployeePwd} />
                </div>
                <Divider orientation="left" >員工部門</Divider>
                <div className='column'>
                  <p>部門名稱</p>
                  <Select
                    showSearch
                    defaultValue="請選擇部門"
                    value={comDepartmentId}
                    style={{ width: 250 }}
                    onChange={DepartmentIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {departmentData.map((department) => (
                      <Select.Option key={department.department_id} value={department.department_id}>
                        {department.department_name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <Divider orientation="left" >員工職位</Divider>
                <div className='column'>
                  <p>職位名稱</p>
                  <Select
                    showSearch
                    defaultValue="請選擇職位"
                    value={comRoleId}
                    style={{ width: 250 }}
                    onChange={RoleIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {RolesData
                      .filter((role) => role.department_id == comDepartmentId)
                      .map((role) => (
                        <Select.Option key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </Select.Option>
                      ))}
                  </Select>
                </div>
                <Divider orientation="left" >員工權限</Divider>
                <div className='column'>
                  <p>權限類別</p>
                  <Switch style={{ width: 150 }} checkedChildren="使用者(user)" unCheckedChildren="管理者(Admin)" defaultChecked={comLimit === '0'} onChange={LimitOnchange} />
                </div>
              </Drawer>
            </>
          </div>
        </>
      )}
    </div>
  )
}

export default Employees;