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
import { getEmployees } from "../../Api/User";
import UserForm from "./UserForm";

const { Title } = Typography;

const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableDensity, setTableDensity] = useState("middle");

  const densityOptions = [
    { key: "large", label: "Default" },
    { key: "middle", label: "Medium" },
    { key: "small", label: "Compact" },
  ];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(); // Fetch data from API
      const formattedData = response.map((emp) => ({
        key: emp._id,
        name: emp.fullname,
        email: emp.contact, // Assuming email is stored in 'contact'
        role: emp.employeeType, // Assuming 'employeeType' is the role
        business: "Company", // Static for now
        status: emp.status === "active",
        deleted: false,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleTableSizeChange = ({ key }) => setTableDensity(key);

  const handleSearch = (value) => {
    const filteredData = data.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      fetchEmployees(); // Reload data from API
      setLoading(false);
    }, 1000);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleStatusChange = (key) => {
    setData((prevData) =>
      prevData.map((item) => (item.key === key ? { ...item, status: !item.status } : item))
    );
  };

  const handleDeleteToggle = (key) => {
    setData((prevData) =>
      prevData.map((item) => (item.key === key ? { ...item, deleted: !item.deleted } : item))
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Business", dataIndex: "business", key: "business" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Switch checked={status} onChange={() => handleStatusChange(record.key)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" />
          {!record.deleted && (
            <Button icon={<DeleteOutlined />} type="link" danger onClick={() => handleDeleteToggle(record.key)} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", width: "100%" }}>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col xs={24} sm={12} md={16}>
          <Title level={4}>Manage Employees</Title>
        </Col>
        <Col xs={24} sm={12} md={8} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={showModal}>+ Add Employee</Button>
        </Col>
      </Row>

      <Card>
        <Space style={{ width: "100%", justifyContent: "flex-end", marginBottom: 16, flexWrap: "nowrap" }}>
          <Input.Search
            placeholder="Search Employees"
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
          <Switch
            checked={showDeleted}
            checkedChildren="Show Deleted"
            unCheckedChildren="Hide Deleted"
            onChange={setShowDeleted}
          />
          <Tooltip title="Refresh">
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} />
          </Tooltip>
          <Tooltip title="Fullscreen">
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} />
          </Tooltip>
          <Tooltip title="Density">
            <Dropdown overlay={<Menu onClick={handleTableSizeChange}>{densityOptions.map((option) => (
              <Menu.Item key={option.key}>{option.label}</Menu.Item>
            ))}</Menu>} placement="bottomRight">
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

      <Modal title="Add Employee" open={isModalVisible} onCancel={handleCancel} footer={null} width="80%" style={{ top: 20 }}>
        <UserForm record={null} CustomFields={() => <></>} />
      </Modal>
    </div>
  );
};

export default UserTable;
