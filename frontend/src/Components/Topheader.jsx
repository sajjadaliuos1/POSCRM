import React from "react";
import { Menu } from "antd";
import { Layout, Dropdown, Avatar, Button, Tooltip, Typography } from "antd";
import {
  ShoppingCartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const TopHeader = () => {
  const navigate = useNavigate();
  const adminName = "Admin User"; // Replace with actual admin name

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Title
        level={3}
        style={{ margin: 0, cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        POS CRM
      </Title>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Tooltip title="POS Screen">
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate("/pos")}
          />
        </Tooltip>
        <Tooltip title="Settings">
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => navigate("/settings")}
          />
        </Tooltip>

        <Dropdown overlay={userMenu} trigger={["click"]}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Avatar
              src="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
              size="large"
              style={{ marginLeft: 8 }}
            />
            <Typography.Text
              style={{ marginLeft: 8, display: { xs: "none", sm: "inline" } }} // Hide on extra small screens
            >
              {adminName}
            </Typography.Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopHeader;