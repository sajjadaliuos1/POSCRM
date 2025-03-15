import React, { useState, useEffect, useMemo } from "react";
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
  Form,
  Menu,
  Dropdown,
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
import UserForm from "./UserForm";

const { Title } = Typography;

const UserTable = () => {
  const initialData = useMemo(() => [
    {
      key: "1",
      name: "Super Admin",
      email: "admin@admin.com",
      role: "Super Admin",
      business: "Business",
      status: true,
      deleted: false,
    },
    {
      key: "2",
      name: " Admin",
      email: "admin@admin.com",
      role: " Admin",
      business: "Business",
      status: true,
      deleted: false,
    },
    {
      key: "3",
      name: "User",
      email: "User@admin.com",
      role: "User",
      business: "Business",
      status: true,
      deleted: false,
    },
    {
      key: "4",
      name: "Deleted User",
      email: "deleted@admin.com",
      role: "User",
      business: "Business",
      status: false,
      deleted: true,
    },
    {
      key: "5",
      name: "Another User",
      email: "another@admin.com",
      role: "User",
      business: "Business",
      status: true,
      deleted: false,
    },
    {
      key: "6",
      name: "Another Deleted User",
      email: "anotherdeleted@admin.com",
      role: "User",
      business: "Business",
      status: false,
      deleted: true,
    },
  ], []);

  const [data, setData] = useState(initialData.filter((item) => !item.deleted));
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [tableDensity, setTableDensity] = useState("middle"); // Default density

  // Define density options
  const densityOptions = [
    { key: "large", label: "Default" },
    { key: "middle", label: "Medium" },
    { key: "small", label: "Compact" },
  ];

  // Handle density change
  const handleTableSizeChange = ({ key }) => {
    setTableDensity(key);
  };

  // Create density dropdown menu
  const densityMenu = (
    <Menu onClick={handleTableSizeChange}>
      {densityOptions.map((option) => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    let filteredData = initialData.filter(
      (item) => showDeleted || !item.deleted
    );

    if (searchText) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setData(filteredData);
  }, [showDeleted, searchText, initialData]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchText("");
      setData(initialData.filter((item) => showDeleted || !item.deleted));
      setLoading(false);
    }, 1000);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleStatusChange = (key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleDeleteToggle = (key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, deleted: !item.deleted } : item
      )
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
      });
  };

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
        <Switch
          checked={status}
          checkedChildren="On"
          unCheckedChildren="Off"
          onChange={() => handleStatusChange(record.key)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" />
          {!record.deleted && (
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              onClick={() => handleDeleteToggle(record.key)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Space
        direction="horizontal"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Title level={4}>Manage Users</Title>
        <Button type="primary" onClick={showModal}>
          + Add User
        </Button>
      </Space>
      <Card>
        <Space
          style={{
            width: "100%",
            justifyContent: "flex-end",
            marginBottom: 16,
            flexWrap: "nowrap",
          }}
        >
          <Input.Search
            placeholder="Search"
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
          {/* Add density dropdown */}
          <Tooltip title="Density">
            <Dropdown overlay={densityMenu} placement="bottomRight">
              <Button icon={<ColumnHeightOutlined />} />
            </Dropdown>
          </Tooltip>
          <Tooltip title="Settings">
            <Button icon={<SettingOutlined />} />
          </Tooltip>
        </Space>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
          rowKey="key"
          size={tableDensity} // Apply the density setting
        />
        <Pagination
          style={{ marginTop: 16, textAlign: "right" }}
          current={1}
          pageSize={25}
          total={data.length}
          showSizeChanger
        />
      </Card>
      <Modal
        title="Add User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      
      footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <UserForm record={null} CustomFields={() => <></>} />
        </Form>
      </Modal>
    </div>
  );
};

export default UserTable;