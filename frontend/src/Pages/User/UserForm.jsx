import React, { useState } from 'react';
import {
  Divider,
  Row,
  Col,
  Form,
  Input,
  Select,
} from 'antd';

const { Option } = Select;

export default function UserForm({ record, CustomFields }) {
  const [commissionType, setCommissionType] = useState('percentage');

  const handleCommissionTypeChange = (value) => {
    setCommissionType(value);
  };

  return (
    <>
      <Divider orientation="left">Personal Information</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name!' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter a valid email!', type: 'email' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter your phone number" />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Role & Permission</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter a username!' }]}
          >
            <Input placeholder="Enter a username" />
          </Form.Item>
        </Col>
        {record === null && (
          <>
            <Col span={8}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter a password!' }]}
              >
                <Input.Password placeholder="Enter a password" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('The two passwords do not match!')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={8}>
          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="business_id"
            label="Business"
            rules={[{ required: true, message: 'Please select a business!' }]}
          >
            <Select placeholder="Select a business">
              <Option value="business1">Business 1</Option>
              <Option value="business2">Business 2</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Incentives & Benefits</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            initialValue={'percentage'}
            name="sales_commission"
            label="Sales Commission Type"
          >
            <Select
              placeholder="Select a Commission Type"
              onChange={handleCommissionTypeChange}
            >
              <Option value="fixed">Fixed</Option>
              <Option value="percentage">Percentage</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="commission_value"
            label="Sales Commission Value"
            rules={[
              () => ({
                validator(_, value) {
                  if (commissionType === 'fixed') {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Value must be greater than 0')
                    );
                  } else if (commissionType === 'percentage') {
                    if (value > 0 && value < 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Value must be between 0 and 100')
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="max_discount" label="Max Discount Allowed">
            <Input type="number" placeholder="Enter max discount allowed!" />
          </Form.Item>
        </Col>
      </Row>
      {/* Conditionally render CustomFields if it's provided */}
      {CustomFields && <CustomFields record={record} module={record ? `user-edit` : `user-add`} />}
    </>
  );
}