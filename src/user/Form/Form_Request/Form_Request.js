import React,{useState,useEffect} from 'react';
import './Form_Request.css';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Select, Breadcrumb, Input, DatePicker, Radio, Button, Upload,message } from 'antd';
import io from 'socket.io-client';
import Cookies from 'js-cookie';

const { TextArea } = Input;

function Form_Request() {
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
    const [matchedEmployee, setMatchedEmployee] = useState(null);
    const [superiorIds, setSuperiorIds] = useState({
        roleIdSuperior: null,
        employeeIdSuperior:null
      });
      
    const [err, setError] = useState(null);

    
    const fetchedProcessData = () => {
        const newSocket = io('http://51.79.145.242:8686');
        setSocket(newSocket);

        console.log('fetchedProcessData');
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

        console.log('Emitting fetchedRolesData');
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

    //   //存departmentname、rolename
    //   useEffect(() => {
    //     if (employeeId && employeeData.length > 0 && departmentData.length > 0 && roleData.length > 0) {
    //         const foundEmployee = employeeData.find(employee => employee.employee_id === employeeId);
    //         // console.log(foundEmployee);
    //         if (foundEmployee) {
    //             const matchedDepartment = departmentData.find(department => department.department_id === foundEmployee.department_id);
    //             const matchedRole = roleData.find(role => role.role_id === foundEmployee.role_id);
    
    //             if (matchedDepartment && matchedRole) {
    //                 // console.log('Matched Department Name:', matchedDepartment.department_name);
    //                 // console.log('Matched Role Name:', matchedRole.role_name);
    //                 setMatchedEmployee(foundEmployee);
    //             } else {
    //                 console.error('Department or Role matching failed. Cannot generate fakeData.');
    //             }
    //         } else {
    //             console.warn('Cannot find a matched employee.');
    //         }
    //     }
    // }, [matchedEmployee, processData, employeeId, roleData]);

    // //跑流程-新增用的   
    // let roleIdSuperior, employeeIdSuperior;
    // const handleReviewData = (data) => {
    //     console.log('Review Data:', data);
    //     console.log('matchedEmployee:', matchedEmployee);
      
    //     const matchemployeeRoleId = matchedEmployee?.role_id;
    //     const matchemployeeDepartmentId = matchedEmployee?.department_id;
      
    //     console.log('matchemployeeRoleId:', matchemployeeRoleId);
    //     console.log('matchemployeeDepartmentId:', matchemployeeDepartmentId);

    //     let isRoleIdMatched, isDepartmentIdMatched;
        
    //     const matchedReviews = data.filter((review) => {
    //       const reviewRoleId = review[4];
    //       const reviewDepartmentId = review[3];
      
    //       console.log('Review Role ID:', reviewRoleId);
    //       console.log('Review Department ID:', reviewDepartmentId);
      
    //       isRoleIdMatched = matchemployeeRoleId === review[4];
    //       isDepartmentIdMatched = matchemployeeDepartmentId === review[3];
      
    //       const isEmptyMatch = reviewRoleId === '' && reviewDepartmentId === '';
    //       return isRoleIdMatched || isEmptyMatch;
    //     });
      
    //     matchedReviews.forEach((review) => {
    //       const { role_id: reviewRoleId, department_id: reviewDepartmentId } = review;
      
    //       const isRoleIdMatched = matchemployeeRoleId === reviewRoleId;
    //       const isDepartmentIdMatched = matchemployeeDepartmentId === reviewDepartmentId;
      
    //       if (isRoleIdMatched || isDepartmentIdMatched) {
    //         if (isRoleIdMatched) {
    //           console.log('roleid 匹配成功');
    //         } else {
    //           console.log('departmentid 匹配成功');
    //         }
    //       } else {
    //         console.log('roleid 和 departmentid 同時匹配失敗');
    //         if (review[4] === '' && review[3] === '') {
    //           console.log('抓到 role_id 和 department_id 為空值的資料：', review);
    //         } else {
    //           console.log('未進入空值判斷條件');
    //         }
      
    //         console.log('Review 數據：', review[5]);
    //         const dataList = review[5].split(',');
      
    //         const firstElement = dataList[0];
      
    //         if (firstElement.length > 3) {
    //           const matchedRole = roleData.find((employee) => employee.role_id === firstElement);
    //           if (matchedRole) {
    //             roleIdSuperior = firstElement;
    //             employeeIdSuperior = matchedRole.employee_id;
    //             console.log(`Review Content 字串長度大於三，根據 role 抓取的 role_Id_Superior: ${roleIdSuperior}`);
    //             console.log(`Review Content 字串長度大於三，根據 role 抓取的 role_Id_Superior: ${employeeIdSuperior}`);
    //           } else {
    //             console.log('未找到匹配的角色');
    //           }
    //         } else {
    //           const matchedRole = roleData.find((role) => role.role_id === matchemployeeRoleId);
      
    //           if (matchedRole) {
    //             for (let i = 0; i < firstElement; i++) {
    //               roleIdSuperior = matchedRole.role_id_superior;
      
    //               const matchedEmployee = employeeData.find((employee) => employee.role_id === roleIdSuperior);
      
    //               if (matchedEmployee) {
    //                 employeeIdSuperior = matchedEmployee.employee_id;
    //                 console.log(`Review Content 字串長度小於三，根據 role 抓取的 role_Id_Superior: ${roleIdSuperior}`);
    //                 console.log(`Review Content 字串長度小於三，根據 roleIdSuperior 抓取的 employee_Id_Superior: ${employeeIdSuperior}`);
    //               } else {
    //                 console.log('未找到匹配的员工');
    //               }
    //             }
    //           } else {
    //             console.log('未找到匹配的角色');
    //           }
    //         }
    //       }
    //     });
      
    //     setReviewData(matchedReviews);
    //     // 在狀態中設置值
    //     setSuperiorIds({
    //       roleIdSuperior: roleIdSuperior,
    //       employeeIdSuperior: employeeIdSuperior,
    //     });
    //   };

    //用Formid找reviewdata      
      useEffect(() => {
        const formId = '3';
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
      }, [matchedEmployee, processData, employeeId, roleData]);      
    
      //提交
      const onFinish = (values) => {
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
                values.priority ,
                values.paymentMethod ,
                values.pay ,
                values.paymentNote ,
                values.remittanceFee ,
                values.requestType ,
                formatDate(values.start_date) ,
                values.payee ,
                values.proxy ,
                values.costDepartment ,
                values.costProject ,
                values.requestReason ,
                values.remarks ,
                values.remittanceInformation ,
                  
              ];
            // console.log("aaa",data);
            const contentValue = data.join(',');
            // setContent(contentValue)
            const processCount = Math.floor(10 + Math.random() * 99);
            const randomCode = Math.floor(10000 + Math.random() * 90000);
            const applyId = employeeId.slice(0, 14) + processCount + randomCode;
                const addRequestData = {
                apply_id: applyId,
                form_type: "請款單",
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

            const valuesOnly = Object.values(addRequestData);
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
                   values.priority ,
                   values.paymentMethod ,
                   values.pay ,
                   values.paymentNote ,
                   values.remittanceFee ,
                   values.requestType ,
                   formatDate(values.start_date) ,
                   values.payee ,
                   values.proxy ,
                   values.costDepartment ,
                   values.costProject ,
                   values.requestReason ,
                   values.remarks ,
                   values.remittanceInformation ,
                  
              ];
            // console.log("aaa",data);
            const contentValue = data.join(',');
            // setContent(contentValue)
            const processCount = Math.floor(10 + Math.random() * 99);
            const randomCode = Math.floor(10000 + Math.random() * 90000);
            const applyId = employeeId.slice(0, 14) + processCount + randomCode;
                const addRequestData = {
                apply_id: applyId,
                form_type: "請款單",
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

            const valuesOnly = Object.values(addRequestData);
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
                                <span>請購及費用補助類</span>
                            </>
                        ),
                    },
                    {
                        title: (
                            <>
                                <span>請款單</span>
                            </>
                        ),
                    },
                ]}
            />
                <Form
                    form={form}
                    onFinish={onFinish}
                    className='form_layout_r'
                     // 設定表單提交的回調函數
                >
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
                        label="請款方式"
                        name="paymentMethod"
                        rules={[
                            {
                                required: true,
                                message: '請選擇使用請款方式',
                            },
                        ]}
                    >
                        <Select onChange={(value) => form.setFieldsValue({ paymentMethod: value })}>
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
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="請款方式(註)"
                        name="paymentNote"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="匯款手續費"
                        name="remittanceFee"
                    >
                        <Select onChange={(value) => form.setFieldsValue({ remittanceFee: value })}>
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
                        <Select onChange={(value) => form.setFieldsValue({ requestType: value })}>
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
                        <DatePicker format="YYYY-MM-DD HH:mm" showTime />
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
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="代墊人"
                        name="proxy"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="成本負擔部門"
                        name="costDepartment"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="成本負擔專案"
                        name="costProject"
                    >
                        <Input />
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
                        <TextArea rows={2} style={{ resize: 'none' }}  />
                    </Form.Item>

                    <Form.Item
                        label="備註"
                        name="remarks"
                    >
                        <TextArea rows={2} style={{ resize: 'none' }}  />
                    </Form.Item>

                    <Form.Item
                        label="廠商匯款資料"
                        name="remittanceInformation"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="上傳檔案"
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
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
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
        </div>
    );
}

export default Form_Request;
