import React, { useState } from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  KeyOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  ContactsOutlined,
  BoxPlotOutlined,
  BankOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Sidemenu = ({ onMenuClick }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  const handleMenuClick = (key) => {
    setActiveMenuItem(key);
    onMenuClick(key);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[activeMenuItem]}
      style={{ backgroundColor: "white", height: "100%" }} // Make background white and height 100%
    >
      <Menu.Item
        key="dashboard"
        icon={<DashboardOutlined />}
        onClick={() => handleMenuClick("dashboard")}
      >
        Dashboard
      </Menu.Item>

      <Menu.SubMenu key="users-roles" icon={<TeamOutlined />} title="Users & Roles">
        <Menu.Item
          key="User"
          icon={<UserOutlined />}
          onClick={() => handleMenuClick("User")}
        >
          Users
        </Menu.Item>
        <Menu.Item key="/roles" icon={<KeyOutlined />}>
          Roles & Permissions
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="manage-products"
        icon={<AppstoreOutlined />}
        title="Manage Products"
      >
        <Menu.Item key="/categories" icon={<TagsOutlined />}>
          Categories
        </Menu.Item>
        <Menu.Item key="/products" icon={<ShoppingCartOutlined />}>
          Products
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="/contacts" icon={<ContactsOutlined />}>
        Contacts
      </Menu.Item>
      <Menu.Item key="/stock-management" icon={<BoxPlotOutlined />}>
        Stock Management
      </Menu.Item>
      <Menu.Item key="/business" icon={<BankOutlined />}>
        Business
      </Menu.Item>
      <Menu.Item key="/pos" icon={<ShoppingCartOutlined />}>
        POS Screen
      </Menu.Item>
      <Menu.Item key="/settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
    </Menu>
  );
};

export default Sidemenu;