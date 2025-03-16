import React, { useState, useEffect } from "react";
import { Menu, Tooltip, Grid } from "antd";
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

const { useBreakpoint } = Grid;

const Sidemenu = ({ onMenuClick }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const screens = useBreakpoint();

  useEffect(() => {
    setCollapsed(!screens.md); // Collapse if screen is below "md" (768px)
  }, [screens]);

  const handleMenuClick = (key) => {
    setActiveMenuItem(key);
    onMenuClick(key);
    
    // Auto-collapse on small screens after selecting a menu item
    if (!screens.md) {
      setCollapsed(true);
    }
  };

  const renderMenuItem = (item) => {
    if (collapsed) {
      return (
        <Tooltip title={item.label} key={item.key}>
          <Menu.Item key={item.key} icon={item.icon} onClick={() => handleMenuClick(item.key)} />
        </Tooltip>
      );
    } else {
      return (
        <Menu.Item key={item.key} icon={item.icon} onClick={() => handleMenuClick(item.key)}>
          {item.label}
        </Menu.Item>
      );
    }
  };

  const renderSubMenu = (subMenu) => {
    if (collapsed) {
      return (
        <Tooltip title={subMenu.title} key={subMenu.key}>
          <Menu.SubMenu key={subMenu.key} icon={subMenu.icon} title="">
            {subMenu.children.map((child) => renderMenuItem(child))}
          </Menu.SubMenu>
        </Tooltip>
      );
    } else {
      return (
        <Menu.SubMenu key={subMenu.key} icon={subMenu.icon} title={subMenu.title}>
          {subMenu.children.map((child) => renderMenuItem(child))}
        </Menu.SubMenu>
      );
    }
  };

  const menuItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "users-roles",
      icon: <TeamOutlined />,
      title: "Users & Roles",
      children: [
        { key: "User", icon: <UserOutlined />, label: "Users" },
        { key: "/roles", icon: <KeyOutlined />, label: "Roles & Permissions" },
      ],
    },
    {
      key: "manage-products",
      icon: <AppstoreOutlined />,
      title: "Manage Products",
      children: [
        { key: "/categories", icon: <TagsOutlined />, label: "Categories" },
        { key: "/products", icon: <ShoppingCartOutlined />, label: "Products" },
      ],
    },
    { key: "/contacts", icon: <ContactsOutlined />, label: "Contacts" },
    { key: "/stock-management", icon: <BoxPlotOutlined />, label: "Stock Management" },
    { key: "/business", icon: <BankOutlined />, label: "Business" },
    { key: "/pos", icon: <ShoppingCartOutlined />, label: "POS Screen" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <Menu mode="inline" selectedKeys={[activeMenuItem]} style={{ height: "100%" }}>
      {menuItems.map((item) =>
        item.children ? renderSubMenu(item) : renderMenuItem(item)
      )}
    </Menu>
  );
};

export default Sidemenu;
