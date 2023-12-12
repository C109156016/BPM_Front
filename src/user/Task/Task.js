import React, { useRef, useState, useEffect } from 'react'
import Highlighter from 'react-highlight-words';
import './Task.css';
import { Tag, Breadcrumb, Space, Table, Drawer, Form, Input, Button, Select, Radio,message } from 'antd';
import { HomeOutlined, DesktopOutlined, SearchOutlined, } from '@ant-design/icons';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import LoadingScreen from '../../login/LoadingScreen'
import '../../login/LoadingScreen.css'

const { TextArea } = Input;

function Task() {
    const [form] = Form.useForm();
    const [socket, setSocket] = useState(null);
    const [processData, setProcessData] = useState([]);
    const [roleData, setRolesData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [matchedProcesses, setMatchedProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [matchedEmployee, setMatchedEmployee] = useState();
    const [reviewData,setReviewData]=useState();
    const [error, setError] = useState(null);
    const [roleId, setRoleId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    const fetchedRolesData = () => {
        const newSocket = io('http://51.79.145.242:8686');
        setSocket(newSocket);

        // console.log('Emitting fetchedRolesData');
        newSocket.emit('fetchedRolesData');

        newSocket.on('RolesData', (data) => {
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

    const fetchedEmployeeData = () => {
        const newSocket = io('http://51.79.145.242:8686');
        setSocket(newSocket);

        newSocket.emit('fetchedEmployeeData');
        newSocket.on('employeeData', (data) => {
            setEmployeeData(data);
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
        fetchedEmployeeData();
    }, []);
 
    //抓employeeid、roleid做後面的邏輯
    useEffect(() => {
        const employeeId = Cookies.get('comEmployeeId');
        setEmployeeId(employeeId);
        const roleId = Cookies.get('comRoleId');
        setRoleId(roleId);
        const newSocket = io('http://51.79.145.242:8686');
        setSocket(newSocket);

        newSocket.emit('fetchedProcessData');
        newSocket.on('ProcessData', (data) => {
            // console.log(data);
            setProcessData(data);
        });

        newSocket.on('error', (err) => {
            setError(err);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    //簽核人是我，顯示待簽核的單
    useEffect(() => {
        if (employeeId && processData.length > 0) {
            const matchedProcesses = processData.filter(process =>
                process.principal_employee_id === employeeId && process.task_status === 0
            );

            setMatchedProcesses(matchedProcesses);
            // console.log('Filtered Processes:', matchedProcesses);

            localStorage.setItem('matchedProcesses', JSON.stringify(matchedProcesses));
            // console.log(typeof matchedProcesses)

        }
    }, [employeeId, processData]);  

    
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState();
    const showLargeDrawer = (record) => {
        console.log("open");
        setSelectedProcess(record);
        setSize('large');
        setOpen(true);
    };

    useEffect(() => {
        if (selectedProcess) {
            const formType = selectedProcess.form_type;
            let formId;
    
            const formTypeMap = {
                '請假單': '1',
                '公差單': '2',
                '請款單': '3',
            };
    
            if (formTypeMap.hasOwnProperty(formType)) {
                formId = formTypeMap[formType];
            } else {
                console.error(`找不到 ${formType} 对应的 formId`);
                return;
            }
    
            const newSocket = io('http://51.79.145.242:8686');
            newSocket.emit('fetchReviewData', [formId]);
    
            newSocket.on('ReviewData', (data) => {
                setReviewData(data);
            });
    
            newSocket.on('error', (err) => {
                console.error('WebSocket 错误:', err);
            });
    
            return () => {
                newSocket.disconnect();
            };
        }
    }, [selectedProcess]);
    
    //跑簽核流程的邏輯
    const handleReviewData = (data) => {

            if (data.role_id === reviewData[0][4]) {
                console.log("role相同", reviewData[0][5]);
            } else if (data.department_id === reviewData[0][3]){ 
                console.log("dept相同", reviewData[0][5]);
                
            }
            
            else{
                let count = 0;

                processData.forEach(process => {
                    if (process.apply_id === selectedProcess.apply_id) {
                        count++;
                    }
                });
            
                const contentList=reviewData[0][5].split(',');

                if (count == contentList.length) {
                    const process_id = selectedProcess.process_id;
                    const commentValue = form.getFieldValue('comment');                    
                    const newSocket = io('http://51.79.145.242:8686');
                    newSocket.emit('appUpdateComData', {
                        "process_id": process_id,
                        "new_task_status": 3, // 已審核通過
                        "new_updated_by": employeeId,
                        "new_comment": commentValue || null
                    });
                } else if (count < contentList.length) {
                    if (contentList[count].length > 3) {
                        const employee = employeeData.find(emp => emp.role_id === contentList[count]);
                        const newSocket = io('http://51.79.145.242:8686');
                        const addLeaveData = {
                            apply_id: selectedProcess.apply_id,                                
                            form_type: selectedProcess.form_type,
                            task_status: 0,
                            comment: "",
                            applier: selectedProcess.applier,
                            content: selectedProcess.content,
                            principal_role_id:contentList[count],
                            principal_employee_id: employee.employee_id,
                            is_deleted: 0,
                            department_name: selectedProcess.department_name,
                            role_name: selectedProcess.role_name,
                            applier_name: selectedProcess.applier_name,
                        };
                        
                        const valuesOnly = Object.values(addLeaveData);
                        socket.emit('appAddComData', valuesOnly);
                        console.log(valuesOnly);
                        
                        // 更新

                        const process_id = selectedProcess.process_id;
                        const commentValue = form.getFieldValue('comment');
                        console.log(`留言: ${commentValue}`);
                        newSocket.emit('appUpdateComData', {
                            "process_id": process_id,
                            "new_task_status": 1, 
                            "new_updated_by": employeeId,
                            "new_comment": commentValue || null
                        });                        
                    } 
                    else if (contentList[count].length < 3) {
                        const role_id_superior = roleData.find(role => role.role_id === roleId)?.role_id_superior;
                        if (role_id_superior) {
                            const employee = employeeData.find(emp => emp.role_id === role_id_superior);
                            if (employee) {
                                const newSocket = io('http://51.79.145.242:8686');
                                const addLeaveData = {
                                    apply_id: selectedProcess.apply_id,                                
                                    form_type: selectedProcess.form_type,
                                    task_status: 0,
                                    comment: "",
                                    applier: selectedProcess.applier,
                                    content: selectedProcess.content,
                                    principal_role_id: role_id_superior,
                                    principal_employee_id: employee.employee_id,
                                    is_deleted: 0,
                                    department_name: selectedProcess.department_name,
                                    role_name: selectedProcess.role_name,
                                    applier_name: selectedProcess.applier_name,
                                };
                                
                                const valuesOnly = Object.values(addLeaveData);
                                socket.emit('appAddComData', valuesOnly);
                                
                                // 更新

                                const process_id = selectedProcess.process_id;
                                const commentValue = form.getFieldValue('comment');
                                console.log(`留言: ${commentValue}`);
                                newSocket.emit('appUpdateComData', {
                                    "process_id": process_id,
                                    "new_task_status": 1, 
                                    "new_updated_by": employeeId,
                                    "new_comment": commentValue || null
                                });
                            }                          
                        }
                    }                    
                }
            }
    };

    // 核准邏輯(待處理 卡在filter)
    const foundEmployee = employeeData.find(employee => employee.employee_id === employeeId);
    const handleApproval = () => {
        console.log("in");
        if (employeeId && employeeData.length > 0 && departmentData.length > 0 && roleData.length > 0) {
            
            if (foundEmployee) {
                const matchedDepartment = departmentData.find(department => department.department_id === foundEmployee.department_id);
                const matchedRole = roleData.find(role => role.role_id === foundEmployee.role_id);

                if (matchedDepartment && matchedRole) {
                    console.log("set")
                    setMatchedEmployee(foundEmployee);
                } else {
                    console.error('Department or Role matching failed. Cannot generate fakeData.');
                }
            } else {
                console.warn('Cannot find a matched employee.');
            }
        }
        handleReviewData(foundEmployee);
        setOpen(false);
        setTimeout(() => {
            setIsLoading(true);
            window.location.reload();
          }, 1000);
    };
   

    
    //退回
    const handleRejection = () => {
        const process_id = selectedProcess.process_id;
        console.log(`test: ${process_id}`);
        const commentValue = form.getFieldValue('comment');
        console.log(`留言: ${commentValue}`);

        if (!commentValue) {
            message.warning('請填寫留言');
            return;
        }

        const newSocket = io('http://51.79.145.242:8686');
        newSocket.emit('appUpdateComData', {
            "process_id": process_id,
            "new_task_status": 2, //退回
            "new_updated_by": employeeId,
            "new_comment": commentValue 
        });

        newSocket.on('appUpdateComData', handleRejection); 
        setOpen(false);
        setTimeout(() => {
            setIsLoading(true);
            window.location.reload();
          }, 1000);

        newSocket.on('error', (err) => {
            console.error('WebSocket 錯誤:', err);
        });

        return () => {
            newSocket.off('appUpdateComData', handleRejection); 
            newSocket.disconnect();
        };
    };

    const onClose = () => {
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
            title: '單號',
            dataIndex: 'apply_id',
            key: 'apply_id',
            ...getColumnSearchProps('apply_id'),
            sorter: (a, b) => a.apply_id.length - b.apply_id.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: '流程名稱',
            dataIndex: 'form_type',
            key: 'form_type',
            ...getColumnSearchProps('form_type'),
            sorter: (a, b) => a.form_type.length - b.form_type.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: '優先程度',
            dataIndex: 'content',
            key: 'priority',
            ...getColumnSearchProps('priority'),
            sorter: (a, b) => a.priority.length - b.priority.length,
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => {
                const contentList = text.split(',');
                const isUrgent = contentList[0] === 'true';
                const tagColor = isUrgent ? '#f50' : '#2db7f5';

                return (
                    <Tag color={tagColor}>
                        {isUrgent ? '急件' : '一般件'}
                    </Tag>
                );
            }
        },
        {
            title: '任務狀態',
            dataIndex: 'task_status',
            key: 'task_status',
            ...getColumnSearchProps('task_status'),
            sorter: (a, b) => a.task_status - b.task_status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record) => {
                if (record.task_status === 0) {
                    let statusText = '待簽核';
                    let statusColor = 'orange';

                    return (
                        <Tag color={statusColor}>
                            {`${statusText}`}
                        </Tag>
                    );
                } else {
                    return null;
                }
            },
        },

        {
            title: '詳細內容',
            key: 'details',
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => showLargeDrawer(record)}>
                        顯示更多
                    </Button>
                </Space>
            ),
        }
    ];

    //這邊要根據form_type去判斷詳細內容跑哪種畫面
    const renderFormFields = () => {
        if (!selectedProcess) {
            return null;
        }

        const formType = selectedProcess.form_type;
        const contentArray = selectedProcess.content.split(',');

        const initialValues = {};
        switch (formType) {
            case '請假單':
                initialValues.priority = contentArray.shift() ;
                initialValues.leaveType = contentArray.shift() ;
                initialValues.start_date = contentArray.shift() ;
                initialValues.end_date = contentArray.shift() ;
                initialValues.leave_days = contentArray.shift() ;
                initialValues.reason = contentArray.shift() ;
                return (
                    <>
                        <Form initialValues={initialValues} form={form}  className='form'>
                            <Form.Item
                                label="優先程度"
                                name="priority"

                            >
                                <Radio.Group readOnly={true}>
                                    <Radio value=" ">一般件</Radio>
                                    <Radio value="true">急件</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="假別"
                                name="leaveType"
                            >
                                <Input defaultValue={initialValues.leaveType} readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="請假日期(起)"
                                name="start_date"

                            >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="請假日期(迄)"
                                name="end_date"

                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="請假時(天)數"
                                name="leave_days"
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="事由"
                                name="reason"


                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="留言"
                                name="comment"
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </>
                );

            case '公差單':
                initialValues.priority = contentArray.shift() ;
                initialValues.businessType = contentArray.shift() ;
                initialValues.start_date = contentArray.shift() ;
                initialValues.end_date = contentArray.shift() ;
                initialValues.business_days = contentArray.shift() ;
                initialValues.project = contentArray.shift() ;
                initialValues.reason = contentArray.shift() ;
                initialValues.itinerary = contentArray.shift() ;
                initialValues.transportationType = contentArray.shift() ;
                initialValues.temporaryExpenses = contentArray.shift() ;
                return (
                    <>
                        <Form initialValues={initialValues} form={form}  className='form'>
                            <Form.Item
                                label="優先程度"
                                name="priority"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇優先程度',
                                    },
                                ]}
                            >
                                <Radio.Group readOnly={true}>
                                    <Radio value=" ">一般件</Radio>
                                    <Radio value="true">急件</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="出差類別"
                                name="businessType"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇出差類別',
                                    },
                                ]}
                            >
                                <Select readOnly={true}>
                                    <Select.Option value="國內出差">國內出差</Select.Option>
                                    <Select.Option value="國外出差">國外出差</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="出差日期(起)"
                                name="start_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇請假日期',
                                    },
                                ]}
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="出差日期(迄)"
                                name="end_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇請假日期',
                                    },
                                ]}
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="出差時(天)數"
                                name="business_days"
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="所屬專案"
                                name="project"
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="事由"
                                name="reason"
                                rules={[
                                    {
                                        required: true,
                                        message: '請填寫事由',
                                    },
                                ]}
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="行程資訊"
                                name="itinerary"
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="使用交通工具"
                                name="transportationType"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇使用交通工具',
                                    },
                                ]}
                            >
                                <Select readOnly={true}>
                                    <Select.Option value="火車">火車</Select.Option>
                                    <Select.Option value="高鐵">高鐵</Select.Option>
                                    <Select.Option value="自行開車">自行開車</Select.Option>
                                    <Select.Option value="計程車">計程車</Select.Option>
                                    <Select.Option value="飛機">飛機</Select.Option>
                                    <Select.Option value="其他">其他</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="暫支費用"
                                name="temporaryExpenses"
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                        </Form>
                    </>
                );

            case '請款單':
                initialValues.priority = contentArray.shift() ;
                initialValues.paymentMethod = contentArray.shift() ;
                initialValues.pay = contentArray.shift() ;
                initialValues.paymentNote = contentArray.shift() ;
                initialValues.remittanceFee = contentArray.shift() ;
                initialValues.requestType = contentArray.shift() ;
                initialValues.start_date = contentArray.shift() ;
                initialValues.payee = contentArray.shift() ;
                initialValues.proxy = contentArray.shift() ;
                initialValues.costDepartment = contentArray.shift() ;
                initialValues.costProject = contentArray.shift() ;
                initialValues.requestReason = contentArray.shift() ;
                initialValues.remarks = contentArray.shift() ;
                initialValues.remittanceInformation = contentArray.shift() ;
                return (
                    <>
                        <Form initialValues={initialValues} form={form}  className='form'>
                            <Form.Item
                                label="優先程度"
                                name="priority"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇優先程度',
                                    },
                                ]}
                            >
                                <Radio.Group readOnly={true}>
                                    <Radio value=" ">一般件</Radio>
                                    <Radio value="true">急件</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                label="請款方式"
                                name="paymentMethod"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇使用請款方式',
                                    },
                                ]}
                            >
                                <Select onChange={(value) => form.setFieldsValue({ paymentMethod: value })} readOnly={true}>
                                    <Select.Option value="現金(含零用金)">現金(含零用金)</Select.Option>
                                    <Select.Option value="匯款">匯款</Select.Option>
                                    <Select.Option value="支票">支票</Select.Option>
                                    <Select.Option value="劃撥">劃撥</Select.Option>
                                    <Select.Option value="銀行扣款">銀行扣款</Select.Option>
                                    <Select.Option value="其他">其他</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="請款費用"
                                name="pay"
                                rules={[
                                    {
                                        required: true,
                                        message: '請填寫使用請款費用',
                                    },
                                ]}
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="請款方式(註)"
                                name="paymentNote"
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="匯款手續費"
                                name="remittanceFee"
                            >
                                <Select onChange={(value) => form.setFieldsValue({ remittanceFee: value })} readOnly={true}>
                                    <Select.Option value="無">無</Select.Option>
                                    <Select.Option value="內含">內含</Select.Option>
                                    <Select.Option value="外加">外加</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="請款類別"
                                name="requestType"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇使用請款類別',
                                    },
                                ]}
                            >
                                <Select onChange={(value) => form.setFieldsValue({ requestType: value })} readOnly={true}>
                                    <Select.Option value="normal">一般請款</Select.Option>
                                    <Select.Option value="prepayment">預付款</Select.Option>
                                </Select>
                            </Form.Item>


                            <Form.Item
                                label="請款日期"
                                name="start_date"
                                rules={[
                                    {
                                        required: true,
                                        message: '請選擇請款日期',
                                    },
                                ]}
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>
                            <Form.Item
                                label="受款廠商"
                                name="payee"
                                rules={[
                                    {
                                        required: true,
                                        message: '請填寫受款廠商',
                                    },
                                ]}
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="代墊人"
                                name="proxy"
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="成本負擔部門"
                                name="costDepartment"
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="成本負擔專案"
                                name="costProject"
                            >
                                <Input readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="請款事由"
                                name="requestReason"
                                rules={[
                                    {
                                        required: true,
                                        message: '請填寫請款事由',
                                    },
                                ]}
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="備註"
                                name="remarks"
                            >
                                <TextArea rows={2} style={{ resize: 'none' }} readOnly={true} />
                            </Form.Item>

                            <Form.Item
                                label="廠商匯款資料"
                                name="remittanceInformation"
                            >
                                <Input readOnly={true} />
                            </Form.Item>
                        </Form>
                    </>
                );

            default:
                return null;
        }
    };

    return (
      <div>
        {isLoading ? <LoadingScreen /> : (
          <>        
        <div>
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
                                <span>我的待辦</span>
                            </>
                        ),
                    },
                ]}
            />
            <Table columns={columns} dataSource={matchedProcesses} className='table-margin' />
            <>
                <Drawer
                    title={'任務名稱'}
                    placement="right"
                    size={size}
                    onClose={onClose}
                    open={open}
                    width={700}>
                        <div className='form_layout'>
                        {renderFormFields()}
                        <div className='btn_align'>
                            <Button type="primary" ghost
                                onClick={()=>handleApproval()}
                                >
                                    核准
                            </Button>
                                &nbsp;&nbsp;&nbsp;
                            <Button type="primary" danger ghost
                                    onClick={()=>handleRejection()}
                                >
                                    退回
                            </Button>
                        </div>
                        </div>
                </Drawer>
            </>
        </div>
        </>
      )}
    </div>
    )
}

export default Task;