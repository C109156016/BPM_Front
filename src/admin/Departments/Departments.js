import React, { Component, useRef, useState, useEffect } from 'react'
import Highlighter from 'react-highlight-words';
import './Departments.css';
import io from 'socket.io-client';
import LoadingScreen from '../../login/LoadingScreen'
import '../../login/LoadingScreen.css'
import {
  HomeOutlined,
  PieChartOutlined,
  SearchOutlined,
  EditOutlined,
  PartitionOutlined,
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
  notification,
  FloatButton
} from 'antd';

function Departments() {

  const [socket, setSocket] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    console.log('Emitting fetchedData');
    newSocket.emit('fetchedData');

    newSocket.on('departmentsData', (data) => {
      console.log(data);
      setDepartmentData(data);
    });

    newSocket.on('error', (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const [open, setOpen] = useState(false);
  const [opengroup, setOpenGroup] = useState(false);
  const [openuser, setOpenUser] = useState(false);
  const [opennew, setOpenNew] = useState(false);
  const [size, setSize] = useState();

  // 新增部門
  const [comId, setId] = useState();
  const [comName, setName] = useState();
  const [comParent, setParent] = useState();
  const [comUpdate, setUpdate] = useState();

  //編輯部門
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editComId, setEditComId] = useState();
  const [editComName, setEditComName] = useState();
  const [editComParent, setEditComParent] = useState();
  const [editComUpdate, setEditComUpdate] = useState();

  //查詢子群組
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [filtereData, setfiltereData] = useState([]);


  // 新增部門
  const IdOnchange = (event) => {
    setId(event.target.value);
  };

  const NameOnchange = (event) => {
    setName(event.target.value);
  };

  const handleChange = (value) => {
    setParent(value);
  };

  const UpdateOnchange = (event) => {
    setUpdate(event.target.value);
  };

  //編輯部門
  const EditIdOnchange = (event) => {
    setEditComId(event.target.value);
  };

  const EditNameOnchange = (event) => {
    setEditComName(event.target.value);
  };

  const EdithandleChange = (value) => {
    setEditComParent(value);
  };

  const EditUpdateOnchange = (event) => {
    setEditComUpdate(event.target.value);
  };

  //編輯視窗
  const showLargeDrawer = (record) => {
    setSelectedRowData(record);
    setEditComId(record.department_id);
    setEditComName(record.department_name);
    setEditComParent(record.department_parent);
    setEditComUpdate(record.department_update);
    setSize('large');
    setOpen(true);
    // console.log(record);

  };

  //查詢子群組
  const showGroupDrawer = (record) => {
    setSize('large');
    setOpenGroup(true);
    setSelectedRowData(record);
    console.log(record.department_parent);
    setSelectedDepartment(record.department_parent);
  };

  useEffect(() => {
    if (selectedDepartment && departmentData.length > 0) {
      const filteredData = departmentData.filter(department => department.department_parent === selectedDepartment);
      setfiltereData(filteredData);
    }
  }, [selectedDepartment, departmentData]);


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
    setOpenGroup(false);
    setOpenUser(false);
    setOpenNew(false);
    setId();
    setName();
    setParent();
    setUpdate();
    api.warning({
      message: '視窗關閉',
      description: '點擊 "X" 按鈕關閉提示訊息',
    });
  };

  //新增
  const handleAdd = () => {
    if (!comName || !comParent) {
      api.error({
        message: '新增失敗',
        description: '請檢查欄位是否有空值及填寫錯誤',
      });
    } else {
      socket.emit('addComData', [comName, comParent, comUpdate]);
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
  //更新
  const handleUpdate = (editComId, editComName, editComParent, editComUpdate) => {
    socket.emit('updateComData', {
      department_id: editComId,
      new_department_name: editComName,
      new_department_parent: editComParent,
      department_update: editComUpdate
    });
    console.log(editComId);
    console.log(editComName);
    console.log(editComUpdate);
    console.log(editComParent);
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
      title: '部門編號',
      dataIndex: 'department_id',
      key: 'department_id',
      ...getColumnSearchProps('department_id'),
      sorter: (a, b) => a.department_id.length - b.department_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '部門名稱',
      dataIndex: 'department_name',
      key: 'department_name',
      ...getColumnSearchProps('department_name'),
      sorter: (a, b) => a.department_name.length - b.department_name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '上層部門',
      dataIndex: 'department_parent',
      key: 'department_parent',
      ...getColumnSearchProps('department_parent'),
      sorter: (a, b) => a.department_parent.length - b.department_parent.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '更新時間',
      dataIndex: 'department_update',
      key: 'department_update',
      ...getColumnSearchProps('department_update'),
    },
    {
      title: '詳細內容',
      key: 'details',
      render: (text, record) => (
        <Space>
          <Button type="dashed" onClick={() => showLargeDrawer(record)} shape="circle" icon={<EditOutlined />}>
          </Button>
          <Button type="dashed" onClick={() => showGroupDrawer(record)} shape="circle" icon={<PartitionOutlined />}>
          </Button>
          {/* <Button type="dashed" onClick={showUserDrawer} shape="circle" icon={<TeamOutlined />}>
          </Button> */}
        </Space>
      ),
    }
  ];

  const GroupColumns = [
    {
      title: '部門編號',
      dataIndex: 'department_id',
      key: 'department_id',
      ...getColumnSearchProps('department_id'),
      sorter: (a, b) => a.department_id.length - b.department_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '部門名稱',
      dataIndex: 'department_name',
      key: 'department_name',
      ...getColumnSearchProps('department_name'),
      sorter: (a, b) => a.department_name.length - b.department_name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '上層部門',
      dataIndex: 'department_parent',
      key: 'department_parent',
      ...getColumnSearchProps('department_parent'),
      sorter: (a, b) => a.department_parent.length - b.department_parent.length,
      sortDirections: ['descend', 'ascend'],
    }
  ];

  return (
    <div>
      {isLoading ? <LoadingScreen /> : (
        <>
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
                      <PieChartOutlined />
                      <span>部門群組</span>
                    </>
                  ),
                },
              ]}
            />
            <Button type="dashed" icon={<PlusOutlined />} onClick={showNewDrawer}>
              新增群組
            </Button>
          </Space>
          <Table columns={columns} dataSource={departmentData} className='table-margin' />
          <>
            {/* 編輯部門 */}
            <Drawer
              title={selectedRowData ? `編輯部門-${selectedRowData.department_name}` : `編輯部門-${comName}`}
              placement="right"
              size={size}
              onClose={onClose}
              open={open}
              width={450}
              extra={
                <Space>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type="primary" onClick={() => {
                    handleUpdate(editComId, editComName, editComParent, editComUpdate);
                  }}>
                    OK
                  </Button>

                </Space>
              }
            >
              <Divider orientation="left" >部門資訊</Divider>
              <div className='column'>
                <p>部門編號</p>
                <Input style={{ width: 250 }} onChange={EditIdOnchange} value={editComId} readOnly />
                <p>部門名稱</p>
                <Input style={{ width: 250 }} onChange={EditNameOnchange} value={editComName} />
                <p>上層部門</p>
                <Select
                  showSearch
                  defaultValue="請選擇部門"
                  value={editComParent}
                  style={{ width: 250 }}
                  onChange={EdithandleChange}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.value ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                  }
                >
                  {departmentData.map((department) => (
                    <Select.Option key={department.department_id} value={department.department_name}>
                      {department.department_name}
                    </Select.Option>
                  ))}
                </Select>

                {/*  不想處理時間:>>> */}
                <p>更新時間<Input onChange={EditUpdateOnchange} value={editComUpdate} disabled /></p>
              </div>
            </Drawer>
            {/* 查看子群組 */}
            <Drawer
              title={`子群組-${selectedDepartment}`}
              placement="right"
              size={size}
              onClose={onClose}
              open={opengroup}
              width={950}
              extra={
                <Space>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type="primary" onClick={onClose}>
                    OK
                  </Button>
                </Space>
              }
            >
              <Table columns={GroupColumns} dataSource={filtereData} className='table-margin' />
            </Drawer>

            {/* 新增部門 */}
            {contextHolder}
            <Drawer
              title={'新增部門'}
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
              {/* 新增部門 */}
              <Divider orientation="left" >部門資訊</Divider>
              <div className='column'>
                <p>部門名稱</p>
                <Input style={{ width: 250 }} onChange={NameOnchange} value={comName} placeholder='請輸入部門名稱'/>
                <p>上層部門</p>
                <Select
                  showSearch
                  defaultValue="請選擇部門"
                  value={comParent}
                  style={{ width: 250 }}
                  onChange={handleChange}
                  optionFilterProp="children"
                  filterOption={(input, option) => (option?.value ?? '').includes(input)}
                  filterSort={(optionA, optionB) =>
                    (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                  }
                >
                  {departmentData.map((department) => (
                    <Select.Option key={department.department_id} value={department.department_name}>
                      {department.department_name}
                    </Select.Option>
                  ))}
                </Select>
                {/*  不想處理時間:>>> */}
                {/* <p>更新時間<Input  onChange={UpdateOnchange} value={comUpdate}/></p> */}
              </div>
            </Drawer>
          </>
        </>
      )}
    </div>
  )
}

export default Departments;