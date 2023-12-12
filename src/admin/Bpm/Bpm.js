import React, { Component, useRef, useState, useEffect } from 'react'
import Highlighter from 'react-highlight-words';
import './Bpm.css';
import io from 'socket.io-client';
import LoadingScreen from '../../login/LoadingScreen'
import '../../login/LoadingScreen.css'

import {
  HomeOutlined,
  DesktopOutlined,
  SearchOutlined,
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
  TreeSelect
} from 'antd';

function Bpm() {
  const [socket, setSocket] = useState(null);
  const [RolesData, setRolesData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [BpmData, setBpmData] = useState([]);
  const [FormCategorysData, setFormCategorysData] = useState([]);
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

  const fetchedBpmData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    console.log('Emitting fetchedBpmData');
    newSocket.emit('fetchedBpmData');

    newSocket.on('BpmData', (data) => {
      setBpmData(data);
    });

    newSocket.on('error', (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  };

  const fetchedFormCategorysData = () => {
    const newSocket = io('http://51.79.145.242:8686');
    setSocket(newSocket);

    console.log('Emitting fetchedFormCategorysData');
    newSocket.emit('fetchedFormCategorysData');

    newSocket.on('FormCategorysData', (data) => {
      console.log(data);
      setFormCategorysData(data);
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

  useEffect(() => {
    fetchedBpmData();
  }, []);

  useEffect(() => {
    fetchedFormCategorysData();
  }, []);


  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const findBottomRoles = (rolesData) => {
      const bottomRolesByDepartment = {};

      rolesData.forEach((role) => {
        const departmentId = role.department_id;

        if (!bottomRolesByDepartment[departmentId]) {
          bottomRolesByDepartment[departmentId] = [];
        }

        const isSuperior = rolesData.some((r) => r.role_id_superior === role.role_id);

        if (!isSuperior) {
          bottomRolesByDepartment[departmentId].push(role.role_id);
        }
      });
      return bottomRolesByDepartment;
    };

    const findUpperManagers = (bottomRolesByDepartment, rolesData) => {
      const upperManagersByDepartment = {};

      Object.keys(bottomRolesByDepartment).forEach((departmentId) => {
        const bottomRoles = bottomRolesByDepartment[departmentId];
        const upperManagerCount = [];

        bottomRoles.forEach((roleId) => {
          let currentRoleId = roleId;

          while (currentRoleId) {
            const currentRole = rolesData.find((role) => role.role_id === currentRoleId);

            if (currentRole && currentRole.role_id_superior) {
              upperManagerCount.push(1);
              currentRoleId = currentRole.role_id_superior;
            } else {
              currentRoleId = null;
            }
          }
        });

        upperManagersByDepartment[departmentId] = upperManagerCount;
      });

      return upperManagersByDepartment;
    };

    const bottomRolesByDepartment = findBottomRoles(RolesData);
    const upperManagersByDepartment = findUpperManagers(bottomRolesByDepartment, RolesData);

    const convertToTreeData = (RolesData, departmentData, upperManagersByDepartment) => {
      const resultTreeData = [];

      const longestArray = Object.values(upperManagersByDepartment).reduce((max, arr) => (arr.length > max.length ? arr : max), []);
      const upperCategoryValue = Array.from({ length: longestArray.length }, () => '1').join(',');

      const upperCategory = {
        label: '上層主管',
        value: upperCategoryValue,
      };

      resultTreeData.push(upperCategory);

      RolesData.forEach((role) => {
        const departmentInfo = departmentData.find((dep) => dep.department_id === role.department_id);

        if (departmentInfo && departmentInfo.department_name) {
          const departmentNode = resultTreeData.find((node) => node.value === role.department_id);

          if (departmentNode) {
            departmentNode.children.push({
              label: role.role_name,
              value: role.role_id,
            });
          } else {
            resultTreeData.push({
              label: departmentInfo.department_name,
              value: role.department_id,
              children: [
                {
                  label: role.role_name,
                  value: role.role_id,
                },
              ],
            });
          }
        }
      });

      setTreeData(resultTreeData);
    };

    convertToTreeData(RolesData, departmentData, upperManagersByDepartment);

    const longestArray = Object.values(upperManagersByDepartment).reduce((max, arr) => (arr.length > max.length ? arr : max), []);
    setLongestArray(longestArray);

  }, [RolesData]);


  const [open, setOpen] = useState(false);
  const [opennew, setOpenNew] = useState(false);
  const [size, setSize] = useState();
  const [longestArray, setLongestArray] = useState([]);

  //新增Bpm
  const [comReviewId, setReviewId] = useState();
  const [comReviewName, setReviewName] = useState();
  const [comFormId, setFormId] = useState();
  const [comDepartmentId, setDepartmentId] = useState();
  const [comRoleId, setRoleId] = useState();
  const [comReviewContent, setReviewContent] = useState();
  const [comReviewUpdate, setReviewUpdate] = useState();


  //新增Bpm
  const ReviewIdOnchange = (event) => {
    setReviewId(event.target.value);
  };

  const ReviewNameOnchange = (event) => {
    setReviewName(event.target.value);
  };

  const FormIdOnchange = (value) => {
    setFormId(value);
  };

  const DepartmentIdOnchange = (value) => {
    setDepartmentId(value);
  };

  const RoleIdOnchange = (value) => {
    setRoleId(value);
  };

  const ReviewContentOnchange = (value) => {
    console.log('Selected values:', value);
    setReviewContent(value);
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
    setReviewId();
    setReviewName();
    setFormId();
    setDepartmentId();
    setRoleId();
    setReviewContent();
    setReviewUpdate();
    api.warning({
      message: '視窗關閉',
      description: '點擊 "X" 按鈕關閉提示訊息',
    });
  };

  //新增
  const handleAdd = () => {
    if (!comReviewName || !comFormId || !comReviewContent) {
      api.error({
        message: '新增失敗',
        description: '請檢查欄位是否有空值及填寫錯誤',
      });
    } else {
      socket.emit('addComBpmData', [comReviewName, comFormId, comDepartmentId, comRoleId, comReviewContent, comReviewUpdate]);
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
      title: '流程編號',
      dataIndex: 'review_id',
      key: 'review_id',
      ...getColumnSearchProps('review_id'),
      sorter: (a, b) => a.review_id.length - b.review_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '流程名稱',
      dataIndex: 'review_name',
      key: 'review_name',
      ...getColumnSearchProps('review_name'),
      sorter: (a, b) => a.department_id.length - b.department_id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '表單類別',
      dataIndex: 'form_id',
      key: 'form_id',
      ...getColumnSearchProps('form_id'),
      sorter: (a, b) => a.role_name.length - b.role_name.length,
      sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: '部門編號',
    //   dataIndex: 'department_id',
    //   key: 'department_id',
    //   ...getColumnSearchProps('department_id'),
    //   sorter: (a, b) => a.department_id.length - b.department_id.length,
    //   sortDirections: ['descend', 'ascend'],
    //   render: (text, record) => {
    //     const departmentInfo = departmentData.find(dep => dep.department_id === text);
    //     return departmentInfo ? departmentInfo.department_name : '無所屬部門';
    //   },
    // },
    // {
    //   title: '職位編號',
    //   dataIndex: 'role_id',
    //   key: 'role_id',
    //   ...getColumnSearchProps('role_id'),
    //   sorter: (a, b) => a.role_id.length - b.role_id.length,
    //   sortDirections: ['descend', 'ascend'],
    //   render: (text, record) => {
    //     const roleInfo = RolesData.find(role => role.role_id === text);
    //     return roleInfo ? roleInfo.role_name : '無所屬職位';
    //   },
    // },
    {
      title: '流程內容',
      dataIndex: 'review_content',
      key: 'review_content',
      ...getColumnSearchProps('review_content'),
      render: (text, record) => {
        console.log('longestArray:', longestArray);
        console.log('text:', text);
    
        const contentText = text.replace(/1(?=,|$)/g, '上層主管');
    
        const uuids = contentText.split(',');
        const roleNames = uuids.map(uuid => {
          const role = RolesData.find(role => role.role_id === uuid.trim());
          return role ? role.role_name : uuid.trim();
        });
    
        return roleNames.join(', ');
      },
    }, 
    {
      title: '更新時間',
      dataIndex: 'review_update',
      key: 'review_update',
      ...getColumnSearchProps('review_update'),
    },
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
                        <span>流程管理</span>
                      </>
                    ),
                  },
                ]}
              />
              <Button type="dashed" icon={<PlusOutlined />} onClick={showNewDrawer}>
                新增流程
              </Button>
            </Space>
            <Table columns={columns} dataSource={BpmData} className='table-margin' />
            <>

              {/* 新增流程 */}
              {contextHolder}
              <Drawer
                title={'新增流程'}
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
                <Divider orientation="left" >流程設定</Divider>
                <div className='column'>
                  <p>流程名稱</p>
                  <Input style={{ width: 250 }} onChange={ReviewNameOnchange} value={comReviewName} />
                  <p>表單類別</p>
                  <Select
                    showSearch
                    placeholder="請選擇表單"
                    value={comFormId}
                    style={{ width: 250 }}
                    onChange={FormIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {FormCategorysData.map((form) => (
                      <Select.Option key={form.form_id} value={form.form_id}>
                        {form.form_name}
                      </Select.Option>
                    ))}
                  </Select>
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
                  <p>職位名稱</p>
                  <Select
                    showSearch
                    placeholder="請選擇職位名稱"
                    value={comRoleId}
                    style={{ width: 250 }}
                    onChange={RoleIdOnchange}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.value ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                    }
                  >
                    {departmentData.map((department) => (
                      <Select.OptGroup key={department.department_id} label={`${department.department_name}`}>
                        {RolesData.filter((role) => role.department_id === department.department_id).map((role) => (
                          <Select.Option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    ))}
                  </Select>
                  <p>流程內容</p>
                  <TreeSelect
                    showSearch
                    treeCheckable
                    treeDefaultExpandAll
                    treeData={treeData}
                    placeholder="請依序選擇流程順序"
                    value={comReviewContent}
                    style={{ width: 250 }}
                    onChange={ReviewContentOnchange}
                    mode="multiple"
                  />
                </div>
              </Drawer>
            </>
          </div>
        </>
      )}
    </div>
  )
}


export default Bpm;