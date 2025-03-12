import React, { useState } from "react";
import {
  Card,
  Space,
  Typography,
  Input,
  Button,
  Table,
  Switch,
  Dropdown,
  Menu,
  Pagination,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SettingOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const densityOptions = [
  { key: "default", label: "Larger" },
  { key: "middle", label: "Middle" },
  { key: "small", label: "Compact" },
];

const UserTable = () => {
  const initialData = [
    {
      key: "1",
      name: "Super Admin",
      email: "admin@admin.com",
      role: "Super Admin",
      business: "Business",
      status: true,
    },
    // Add more data here if needed for testing responsiveness
  ];

  const [data, setData] = useState(initialData);
  const [tableSize, setTableSize] = useState("default");
  const [loading, setLoading] = useState(false); // For refresh loading state

  const handleSearch = (value) => {
    const filteredData = initialData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setData(filteredData);
  };

  const handleTableSizeChange = ({ key }) => {
    setTableSize(key);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate data fetching or refresh
    setTimeout(() => {
      setData(initialData); // Reset to initial data
      setLoading(false);
    }, 1000); // Simulate 1 second loading
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Business",
      dataIndex: "business",
      key: "business",
      sorter: (a, b) => a.business.localeCompare(b.business),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Switch checked={status} checkedChildren="On" unCheckedChildren="Off" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} type="link" />
          <Button icon={<DeleteOutlined />} type="link" danger />
        </Space>
      ),
    },
  ];

  const densityMenu = (
    <Menu onClick={handleTableSizeChange}>
      {densityOptions.map((option) => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  const dropdownMenu = (
    <Menu>
      <Menu.Item key="1" icon={<FilterOutlined />}>
        Filter
      </Menu.Item>
      <Menu.Item key="2" icon={<SortAscendingOutlined />}>
        Sort
      </Menu.Item>
      <Menu.Item key="3" icon={<SettingOutlined />}>
        Table Settings
      </Menu.Item>
      <Menu.Item key="4" icon={<CloseOutlined />}>
        Close
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ width: "100%" }}>
      <Space
        direction="horizontal"
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 0,
          padding: "0 16px", // Reduced padding
        }}
      >
        <Title level={4}>Manage Users</Title>
        <Button type="primary">+ Add User</Button>
      </Space>
      <Card style={{ width: "100%", margin: "0px auto" }}>
        <Space
          direction="horizontal"
          style={{ width: "100%", marginBottom: 16, flexWrap: "wrap" }}
        >
          <Input.Search
            placeholder="Search"
            style={{ width: "150px", marginBottom: "8px" }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
          />
          <Switch
            style={{ marginBottom: "8px" }}
            checkedChildren="Show Deleted"
            unCheckedChildren="Show Deleted"
          />
          <Dropdown overlay={dropdownMenu}>
            <Button>
              <FilterOutlined />
            </Button>
          </Dropdown>
        </Space>

        <Space
          direction="horizontal"
          style={{ width: "100%", justifyContent: "flex-end", marginBottom: 8 }}
        >
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              size="small"
              style={{ marginRight: 8 }}
              onClick={handleRefresh}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Fullscreen">
            <Button
              icon={<FullscreenOutlined />}
              size="small"
              style={{ marginRight: 8 }}
              onClick={handleFullscreen}
            />
          </Tooltip>
          <Dropdown overlay={densityMenu} trigger={["click"]}>
            <Tooltip title="Density">
              <Button
                icon={<ColumnHeightOutlined />}
                size="small"
                style={{ marginRight: 8 }}
              />
            </Tooltip>
          </Dropdown>
          <Tooltip title="Table Settings">
            <Button icon={<SettingOutlined />} size="small" />
          </Tooltip>
        </Space>

        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            size={tableSize}
            loading={loading}
          />
        </div>

        <Space
          direction="horizontal"
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ marginBottom: "8px" }}>1-1 of 1 items</div>
          <Pagination current={1} pageSize={25} total={1} showSizeChanger />
        </Space>
      </Card>
    </div>
  );
};

export default UserTable;