import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress, List, Avatar, Divider, Space } from 'antd';
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LineChartOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const DashboardContent = () => {
  const salesData = [
    { title: 'Total Sales', value: 12500, icon: <DollarCircleOutlined />, color: '#52c41a' },
    { title: 'Orders', value: 320, icon: <ShoppingCartOutlined />, color: '#1890ff' },
    { title: 'Customers', value: 150, icon: <UserOutlined />, color: '#fa8c16' },
  ];

  const recentSales = [
    { name: 'Product A', amount: 150, avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
    { name: 'Product B', amount: 220, avatar: 'https://zos.alipayobjects.com/rmsportal/QViVtJAPEvZtKjRnsKBG.png' },
    { name: 'Product C', amount: 180, avatar: 'https://zos.alipayobjects.com/rmsportal/HfXyehPQwKXhIiWtYkLF.png' },
  ];

  const salesProgress = 75; // Example progress value

  return (
    <div style={{ padding: '24px', width:'100%' }}>
      <Title level={2} style={{ textAlign: 'left', marginBottom: '24px' }}>Dashboard Overview</Title>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        {salesData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                precision={0}
                prefix={item.icon}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Card title="Sales Trend" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <LineChartOutlined style={{ fontSize: '60px', color: '#2f54eb' }} />
              <Paragraph style={{ marginTop: '10px' }}>Sales growth over the last month.</Paragraph>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Card title="Sales Progress" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Progress type="circle" percent={salesProgress} width={150} />
              <Paragraph style={{ marginTop: '10px' }}>{salesProgress}% of monthly sales target achieved.</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0' }} />

      <Row gutter={16}>
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Card title="Recent Sales" style={{ height: '100%' }}>
            <List
              itemLayout="horizontal"
              dataSource={recentSales}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    description={<Space><DollarCircleOutlined />{item.amount}</Space>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
          <Card title="Customer Overview" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <UserOutlined style={{ fontSize: '60px', color: '#13c2c2' }} />
              <Paragraph style={{ marginTop: '10px' }}>Overall customer growth and engagement.</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Top Selling Products">
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <RiseOutlined style={{ fontSize: '60px', color: '#eb2f96' }} />
              <Paragraph style={{ marginTop: '10px' }}>Products with the highest sales volume.</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;