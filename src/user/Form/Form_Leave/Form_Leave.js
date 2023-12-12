import React,{useState,useEffect} from 'react';
import './Form_Leave.css';
import { Form, Input, Button, Select, DatePicker, Upload, Radio,message } from 'antd';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

const { TextArea } = Input;

function Form_Leave() {
    const [form] = Form.useForm();  
    const [socket, setSocket] = useState(null);
    const [processData, setProcessData] = useState([]);
    const [roleData, setRolesData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [roldId, setRoleId] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [err, setError] = useState(null);


    
    const fetchedProcessData = () => {
        const newSocket = io('http://51.79.145.242:8686');
        setSocket(newSocket);

        // console.log('fetchedProcessData');
        newSocket.emit('ProcessData');

        newSocket.on('ProcessData', (data) => {
            setProcessData(data);
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
        fetchedProcessData();
      }, []);
    
      useEffect(() => {
        fetchedRolesData();
      }, []);
    
      useEffect(() => {
        fetchedData();
      }, []);
      useEffect(() => {
        fetchedEmployeeData();
      }, []);
    
      useEffect(() => {
        const fetchData = async () => {
          const employeeId = Cookies.get('comEmployeeId');
          setEmployeeId(employeeId);
          const roldId = Cookies.get('comRoleId');
          setRoleId(roldId);
          const employeeName = Cookies.get('comEmployeeName');
          setEmployeeName(employeeName);
        };
        fetchData();
      }, []);

    useEffect(() => {
      const formId = '1';
      const newSocket = io('http://51.79.145.242:8686');
      newSocket.emit('fetchReviewData', [formId]);
    
      newSocket.on('ReviewData', (data)=>{
        // console.log(data);
        setReviewData(data);
      });
    
      newSocket.on('error', (err) => {
        console.error('WebSocket 錯誤:', err);
      });
    
      return () => {
        newSocket.disconnect();
      };
    }, []);    

      //提交
      const onFinish = (values) => {
        // console.log("in");
        // console.log('234',reviewData);
        const foundEmployee = employeeData.find(employee => employee.employee_id === employeeId);
        const matchedDepartment = departmentData.find(department => department.department_id === foundEmployee.department_id).department_name;
        const matchedRole = roleData.find(role => role.role_id === foundEmployee.role_id).role_name;

        // console.log('111',foundEmployee);
        if (foundEmployee.role_id === reviewData[0][4]) {
          // console.log("role相同", reviewData[0][5]);
        } else if (foundEmployee.department_id === reviewData[0][3]){ 
          // console.log("dept相同", reviewData[0][5]);
        }
        else{
            const contentList=reviewData[0][5].split(',');
            if (contentList[0].length > 3) {
            // console.log('大於三');
            const employee = employeeData.find(emp => emp.role_id === contentList[0]).employee_id;
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return `${year}/${month}/${day} ${hours}:${minutes}`;
          };
              const data = [
                  values.priority || null,
                  values.leaveType || null,
                  formatDate(values.start_date) || null,
                  formatDate(values.end_date) || null,
                  values.leave_days || null,
                  values.reason || null,
                  
              ];
            // console.log("aaa",data);
            const contentValue = data.join(',');
            // setContent(contentValue)
            const processCount = Math.floor(10 + Math.random() * 99);
            const randomCode = Math.floor(10000 + Math.random() * 90000);
            const applyId = employeeId.slice(0, 14) + processCount + randomCode;
                const addLeaveData = {
                apply_id: applyId,
                form_type: "請假單",
                task_status: 0,
                comment: "",
                applier: employeeId,
                content: contentValue,
                principal_role_id:contentList[0],
                principal_employee_id: employee,
                is_deleted: 0,
                department_name: matchedDepartment,
                role_name: matchedRole,
                applier_name: employeeName,
            };

            const valuesOnly = Object.values(addLeaveData);
            socket.emit('appAddComData', valuesOnly);

            console.log('表單提交的數據:', valuesOnly);
            message.success('表單提交成功');

            form.resetFields();  

        }else if (contentList[0].length < 3) {
            // console.log("字串小於三");
            const role_id_superior = roleData.find(role => role.role_id === roldId)?.role_id_superior;
            const employee = employeeData.find(emp => emp.role_id === role_id_superior).employee_id;
            const formatDate = (dateString) => {
              const date = new Date(dateString);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const hours = String(date.getHours()).padStart(2, '0');
              const minutes = String(date.getMinutes()).padStart(2, '0');
              return `${year}/${month}/${day} ${hours}:${minutes}`;
          };
              const data = [
                  values.priority || null,
                  values.leaveType || null,
                  formatDate(values.start_date) || null,
                  formatDate(values.end_date) || null,
                  values.leave_days || null,
                  values.reason || null,
                  
              ];
            // console.log("aaa",data);
            const contentValue = data.join(',');
            // setContent(contentValue)
            const processCount = Math.floor(10 + Math.random() * 99);
            const randomCode = Math.floor(10000 + Math.random() * 90000);
            const applyId = employeeId.slice(0, 14) + processCount + randomCode;
                const addLeaveData = {
                apply_id: applyId,
                form_type: "請假單",
                task_status: 0,
                comment: "",
                applier: employeeId,
                content: contentValue,
                principal_role_id: role_id_superior,
                principal_employee_id: employee,
                is_deleted: 0,
                department_name: matchedDepartment,
                role_name: matchedRole,
                applier_name: employeeName,
            };

            const valuesOnly = Object.values(addLeaveData);
            socket.emit('appAddComData', valuesOnly);

            console.log('表單提交的數據:', valuesOnly);
            message.success('表單提交成功');

            form.resetFields();  
          }
        }
      };
    
    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    };

    return (
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
                                <span>差勤表單</span>
                            </>
                        ),
                    },
                    {
                        title: (
                            <>
                                <span>請假單</span>
                            </>
                        ),
                    },
                ]}
            />
            <div className='form-margin'>
                <Form form={form} onFinish={onFinish}>
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
                        <Radio.Group>
                            <Radio value=" ">一般件</Radio>
                            <Radio value="true">急件</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="假別"
                        name="leaveType"
                        rules={[
                            {
                                required: true,
                                message: '請選擇假別',
                            },
                        ]}
                    >
                        <Select>
                            <Select.Option value="事假">事假</Select.Option>
                            <Select.Option value="病假">病假</Select.Option>
                            <Select.Option value="公假">公假</Select.Option>
                            <Select.Option value="喪假">喪假</Select.Option>
                            <Select.Option value="特休">特休</Select.Option>
                            <Select.Option value="榮譽假">榮譽假</Select.Option>
                            <Select.Option value="補假">補假</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                      label="請假日期(起)"
                      name="start_date"
                      rules={[
                        {
                            required: true,
                            message: '請選擇日期(起)',
                        },
                    ]}
                    
                    >
                        <DatePicker  format="YYYY-MM-DD HH:mm" showTime />
                    </Form.Item>
                    <Form.Item
                      label="請假日期(迄)"
                      name="end_date"
                      rules={[
                        {
                            required: true,
                            message: '請選擇日期(迄)',
                        },
                    ]}
                    
                    >
                        <DatePicker  format="YYYY-MM-DD HH:mm" showTime />
                    </Form.Item>

                    <Form.Item
                        label="請假時(天)數"
                        name="leave_days"
                        
                    >
                        <Input/>
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
                        <TextArea rows={2} style={{ resize: 'none' }}  />
                    </Form.Item>
                    <Form.Item label="上傳檔案" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload action="/upload.do" listType="picture-card">
                            <div>
                            <PlusOutlined />
                            <div
                                style={{
                                marginTop: 4,
                                }}
                            >
                                Upload
                            </div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" >
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Form_Leave;
