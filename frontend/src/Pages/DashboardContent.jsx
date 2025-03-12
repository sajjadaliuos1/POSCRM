import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const DashboardContent = () => {
  return (
    <Card style={{ width: '100%', textAlign: 'center' }}>
      <Title level={2}>Welcome to the Dashboard</Title>
      <p>This is the main dashboard content.</p>
    </Card>
  );
};

export default DashboardContent;
