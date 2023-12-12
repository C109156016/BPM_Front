import React, { Component, useRef, useState, useEffect } from 'react'
import Highlighter from 'react-highlight-words';
import './Roles.css';
import io from 'socket.io-client';
import LoadingScreen from '../../login/LoadingScreen'
import '../../login/LoadingScreen.css'

import {
  HomeOutlined,
  DesktopOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined
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
  notification
} from 'antd';

function Roles() {
  const [socket, setSocket] = useState(null);
  const [RolesData, setRolesData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchedRolesData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    console.log('Emitting fetchedRolesData');
    newSocket.emit('fetchedRolesData');

    newSocket.on('RolesData', (data) => {
      console.log(data);
      setRolesData(data);
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

    console.log('Emitting fetchedData');
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


  useEffect(() => {
    fetchedRolesData();
  }, []);

  useEffect(() => {
    fetchedData();
  }, []);



  const [open, setOpen] = useState(false);
  const [opennew, setOpenNew] = useState(false);
  const [size, setSize] = useState();

  //新增職位
  const [comRoleId, setId] = useState();
  const [comRoleName, setName] = useState();
  const [comRoleSup, setSup] = useState();
  const [comDepartmentId, setDepartmentId] = useState();
  const [comRoleUpdate, setRoleUpdate] = useState();

  //編輯職位
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editcomRoleId, setEditComId] = useState();
  const [editcomRoleName, setEditName] = useState();
  const [editcomRoleSup, setEditSup] = useState();
  const [editcomDepartmentId, setEditDepartmentId] = useState();
  const [editcomRoleUpdate, setEditRoleUpdate] = useState();

  //新增職位
  const IdOnchange = (event) => {
    setId(event.target.value);
  };

  const NameOnchange = (event) => {
    setName(event.target.value);
  };

  const DepartmentIdOnchange = (value) => {
    setDepartmentId(value);
  };

  const SupOnchange = (value) => {
    setSup(value);
  };

  useEffect(() => {
    console.log('comDepartmentId changed:', comDepartmentId);
  }, [comDepartmentId]);


  //編輯職位
  const EditIdOnchange = (event) => {
    setEditComId(event.target.value);
  };

  const EditNameOnchange = (event) => {
    setEditName(event.target.value);
  };

  const EditSupOnChange = (value) => {
    setEditSup(value);
  };

  const EditDepartmentOnChange = (value) => {
    setEditDepartmentId(value);
  };

  const EditUpdateOnchange = (event) => {
    setEditRoleUpdate(event.target.value);
  };

  //編輯視窗
  const showLargeDrawer = (record) => {
    setSelectedRowData(record);
    setEditComId(record.role_id);
    setEditName(record.role_name);
    setEditSup(record.role_id_superior);
    setEditDepartmentId(record.department_id);
    setEditRoleUpdate(record.role_update);
    setSize('large');
    setOpen(true);
    console.log(record);
  };


  //新增視窗
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
    setSup();
    setDepartmentId();
    setRoleUpdate();
    api.warning({
      message: '視窗關閉',
      description: '點擊 "X" 按鈕關閉提示訊息',
    });
  };

  //新增
  const handleAdd = () => {
    if (!comRoleName || !comRoleSup || !comDepartmentId) {
      api.error({
        message: '新增失敗',
        description: '請檢查欄位是否有空值及填寫錯誤',
      });
    } else {
      socket.emit('addComRolesData', [comRoleName, comRoleSup, comDepartmentId, comRoleUpdate]);
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
  const handleUpdate = (editcomRoleId, editcomRoleName, editcomRoleSup, editcomDepartmentId, editcomRoleUpdate) => {
    socket.emit('updateRoleComData', {
      role_id: editcomRoleId,
      new_role_name: editcomRoleName,
      new_role_sup: editcomRoleSup,
      new_department_id: editcomDepartmentId,
      role_update: editcomRoleUpdate
    });
    console.log(editcomRoleId);
    console.log(editcomRoleName);
    console.log(editcomRoleSup);
    console.log(editcomDepartmentId);
    console.log(editcomRoleUpdate);
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
      title: '職位編號',
      dataIndex: 'role_id',
      key: 'role_id',
      ...getColumnSearchProps('role_id'),
      sorter: (a, b) => a.role_id.length - b.role_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '所屬部門',
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
      title: '職位名稱',
      dataIndex: 'role_name',
      key: 'role_name',
      ...getColumnSearchProps('role_name'),
      sorter: (a, b) => a.role_name.length - b.role_name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '職位上層',
      dataIndex: 'role_id_superior',
      key: 'role_id_superior',
      ...getColumnSearchProps('role_id_superior'),
      sorter: (a, b) => a.role_id_superior.length - b.role_id_superior.length,
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => {
        const roleInfo = RolesData.find(role => role.role_id === text);
        return roleInfo ? roleInfo.role_name : '無職位上層';
      },
    },
    {
      title: '更新時間',
      dataIndex: 'role_update',
      key: 'role_update',
      ...getColumnSearchProps('role_update'),
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
                        <DesktopOutlined />
                        <span>職位角色</span>
                      </>
                    ),
                  },
                ]}
              />
              <Button type="dashed" icon={<PlusOutlined />} onClick={showNewDrawer}>
                新增職位
              </Button>
            </Space>
            <Table columns={columns} dataSource={RolesData} className='table-margin' />
            <>
              <Drawer
                title={selectedRowData ? `編輯職位-${selectedRowData.role_name}` : `編輯部門-${comRoleName}`}
                placement="right"
                size={size}
                onClose={onClose}
                open={open}
                width={450}
                extra={
                  <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" onClick={() => {
                      handleUpdate(editcomRoleId, editcomRoleName, editcomRoleSup, editcomDepartmentId, editcomRoleUpdate);
                    }}>
                      OK
                    </Button>
                  </Space>
                }
              >
                <Divider orientation="left" >職位資訊</Divider>
                <div className='column'>
                  <p>部門名稱</p>
                  <Select
                    showSearch
                    placeholder="請選擇部門"
                    value={editcomDepartmentId}
                    style={{ width: 250 }}
                    onChange={EditDepartmentOnChange}
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
                  <p>職位編號</p>
                  <Input style={{ width: 250 }} onChange={EditIdOnchange} value={editcomRoleId} />
                  <p>職位名稱</p>
                  <Input style={{ width: 250 }} onChange={EditNameOnchange} value={editcomRoleName} />
                  <p>職位上層</p>
                  <Select
                    showSearch
                    placeholder="請選擇上層主管"
                    value={editcomRoleSup}
                    style={{ width: 250 }}
                    onChange={EditSupOnChange}
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
                  <p>更新時間</p>
                  <Input style={{ width: 250 }} onChange={EditUpdateOnchange} value={editcomRoleUpdate} disabled />
                </div>
              </Drawer>

              {/* 新增職位 */}
              {contextHolder}
              <Drawer
                title={'新增職位'}
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
                <Divider orientation="left" >職位資訊</Divider>
                <div className='column'>
                  <p>部門名稱</p>
                  <Select
                    showSearch
                    placeholder="請選擇部門"
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
                  {/* <p>職位編號</p>
                <Input style={{ width: 250 }}  onChange={IdOnchange} value={comRoleId} /> */}
                  <p>職位名稱</p>
                  <Input style={{ width: 250 }} onChange={NameOnchange} value={comRoleName} placeholder="請輸入職位名稱" />
                  <p>職位上層</p>
                  <Select
                    showSearch
                    placeholder="請選擇上層主管"
                    value={comRoleSup}
                    style={{ width: 250 }}
                    onChange={SupOnchange}
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
              </Drawer>
            </>
          </div>
        </>
      )}
    </div>
  )
}

export default Roles;