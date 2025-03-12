import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidemenu from '../Components/Sidemenu';
import TopHeader from '../Components/TopHeader';
import DashboardContent from './DashboardContent';
import Userdetails from './Userdetails';

const { Content, Sider, Header } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderContent = () => {
    switch (activeComponent) {
      case 'User':
        return <Userdetails />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh',minWidth:'220vh', marginBottom: 0, }}>
      <Header style={{ background: '#fff', padding: 0, position: 'fixed', width: '100%', zIndex: 1000 }}>
        <TopHeader />
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          style={{ background: '#001529' }}
        >
          <Sidemenu onMenuClick={setActiveComponent} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
