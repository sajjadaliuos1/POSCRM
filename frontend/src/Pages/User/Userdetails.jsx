import React, { useState, useEffect } from "react";
import {
  Card,
  Space,
  Typography,
  Input,
  Button,
  Table,
  Switch,
  Tooltip,
  Pagination,
  Modal,
  Row,
  Col,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";
import { getEmployees, getEmployeeTypes, updateEmployeeStatus } from "../../Api/User"; // Ensure updateEmployeeStatus API exists
import UserForm from "./UserForm";

const { Title } = Typography;

const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableDensity, setTableDensity] = useState("middle");
  const [employeeTypes, setEmployeeTypes] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  // Initialize message API
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRecord, setSelectedRecord] = useState(null);
  // Fetch Employee Types from API
  const fetchEmployeeTypes = async () => {
    try {
      const response = await getEmployeeTypes();
      const typeMapping = response.reduce((acc, type) => {
        acc[type._id] = type.type;
        return acc;
      }, {});
      setEmployeeTypes(typeMapping);
    } catch (error) {
      console.error("Error fetching employee types:", error);
      messageApi.error("Failed to load employee types.");
    }
  };
  
  // Fetch Employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      const formattedData = response.map((emp) => ({
        key: emp._id,
        name: emp.fullname,
        contact: emp.contact,
        address: emp.address,
        employeetypes: employeeTypes[emp.employeeType] || "Unknown",
        currentsalary: emp.currentsalary,
        
        status: emp.status === "active",
        deleted: false,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      messageApi.error("Failed to load employees data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployeeTypes();
  }, []);

  useEffect(() => {
    if (Object.keys(employeeTypes).length > 0) {
      fetchEmployees();
    }
  }, [employeeTypes]);
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };
  // Handle Employee Status Change
  const handleStatusChange = async (key, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Show loading message
    const hide = messageApi.loading('Updating status...', 0);
    
    try {
      // Update the UI optimistically
      setData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, status: newStatus } : item
        )
      );
      
      // Call the API to update the status
      await updateEmployeeStatus(key, newStatus ? "active" : "inactive");
      
      // Close loading message
      hide();
      
      // Show success message with duration and callback
      messageApi.success({
        content: `User status changed to ${newStatus ? "Active" : "Inactive"} successfully.`,
        duration: 4, 
        style: { marginTop: '20px' },
        onClose: () => {
          console.log('Status update message closed');
        }
      });
    } catch (error) {
      // Close loading message
      hide();
      
      // Revert the optimistic update
      setData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, status: currentStatus } : item
        )
      );
      
      // Show error message
      messageApi.error({
        content: "Failed to update user status. Please try again.",
        duration: 4
      });
      console.error("Status update error:", error);
    }
  };

  // Handle search functionality
  const handleSearch = (value) => {
    if (!value.trim()) {
      fetchEmployees(); // Reload all data if search is empty
      return;
    }
    
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setData(filteredData);
  };

  // Refresh Data
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchEmployees();
      setLoading(false);
      messageApi.success("Data refreshed successfully.");
    }, 1000);
  };

  // Toggle Fullscreen Mode
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle table density change
  const handleTableSizeChange = ({ key }) => {
    setTableDensity(key);
    messageApi.info(`Table density set to ${key}.`);
  };

  // Show Add Employee Modal


  // Hide Modal


  // Table Columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact", dataIndex: "contact", key: "contact" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Employee Type", dataIndex: "employeetypes", key: "employeetypes" },
    { title: "Current Salary", dataIndex: "currentsalary", key: "currentsalary" },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        const imageUrl = record.image || `http://localhost:5000/api/img/${record.key}`;
    
        return (
          <img
            src={imageUrl}
            alt="Employee"
            width="80"
            height="50"
            style={{ objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => {
              setPreviewImage(imageUrl);
              setIsPreviewVisible(true);
            }}
            onError={(e) => (e.target.src = "https://via.placeholder.com/80x50?text=No+Image")}
          />
        );
      },
    },
    
    
    
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch
          checked={status}
          onChange={() => handleStatusChange(record.key, status)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          style={{ backgroundColor: status ? "#1890ff" : "#ff4d4f" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)} />
          {!record.deleted && (
            <Button icon={<DeleteOutlined />} type="link" danger />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", width: "100%" }}>
      {/* Include context holder for message API */}
      {contextHolder}
      
      <Row justify="space-between">
              <Col>
                <Title level={4}>Manage Employees</Title>
              </Col>
              <Col>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  + Add Employee
                </Button>
              </Col>
            </Row>

      <Card>
        <Space style={{ width: "100%", justifyContent: "flex-end", marginBottom: 16, flexWrap: "nowrap" }}>
          <Input.Search
            placeholder="Search Employees"
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Switch
            checked={showDeleted}
            checkedChildren="Show Deleted"
            unCheckedChildren="Hide Deleted"
            onChange={(checked) => {
              setShowDeleted(checked);
              messageApi.info(`${checked ? 'Showing' : 'Hiding'} deleted employees.`);
            }}
          />
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
          </Tooltip>
          <Tooltip title="Fullscreen">
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} />
          </Tooltip>
          <Tooltip title="Density">
            <Dropdown overlay={
              <Menu onClick={handleTableSizeChange}>
                {["large", "middle", "small"].map((key) => (
                  <Menu.Item key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Menu.Item>
                ))}
              </Menu>
            } placement="bottomRight">
              <Button icon={<ColumnHeightOutlined />} />
            </Dropdown>
          </Tooltip>
          <Tooltip title="Settings">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
        </Space>

        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            loading={loading}
            rowKey="key"
            size={tableDensity}
            scroll={{ x: "100%" }}
            bordered
          />
        </div>

        <Pagination
          style={{ marginTop: 16, textAlign: "center" }}
          current={1}
          pageSize={25}
          total={data.length}
          showSizeChanger
        />
          
      </Card>

      <Modal
             title={selectedRecord ? "Edit Employee" : "Add Employee"}
             open={isModalVisible}
             onCancel={handleCancel}
             footer={null}
             width="80%" 
             style={{ top: 20 }}
           >
             <UserForm
               record={selectedRecord}
               onSuccess={() => {
                 handleCancel();
                 fetchEmployees();
                 messageApi.success("Employee saved successfully!");
               }}
             />
           </Modal>
      <Modal
  open={isPreviewVisible}
  footer={null}
  onCancel={() => setIsPreviewVisible(false)}
  centered
>
  <img 
    src={previewImage || "https://via.placeholder.com/300x300?text=No+Preview"} 
    alt="Employee image" 
    style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '10px' }} 
  />
</Modal>


    </div>
  );
};

export default UserTable;