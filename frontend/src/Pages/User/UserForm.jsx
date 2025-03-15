import React, { useState } from "react";
import { Divider, Row, Col, Form, Input, Select, Upload, Button, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Import Axios for API calls

const { Option } = Select;

export default function UserForm({ record, CustomFields }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!record; // Check if editing or creating new user

  // Handle Image Upload Preview
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        image: imageUrl, // Send image URL (or handle file upload separately)
      };

      if (isEditing) {
        await axios.put(`/api/users/${record.id}`, payload); // Update user
        message.success("User updated successfully!");
      } else {
        await axios.post("/api/users", payload); // Create new user
        message.success("User created successfully!");
      }
    } 
    catch {
      message.error("An error occurred. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} initialValues={record || {}}>
      <Divider orientation="left">Personal Information</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name!" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="contact"
            label="Contact"
            rules={[{ required: true, message: "Please enter contact number!" }]}
          >
            <Input placeholder="Enter contact number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address!" }]}
          >
            <Input.TextArea placeholder="Enter address" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Employment Details</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="on_leave">On Leave</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="employeeType"
            label="Employee Type"
            rules={[{ required: true, message: "Please select employee type!" }]}
          >
            <Select placeholder="Select employee type">
              <Option value="full_time">Full-time</Option>
              <Option value="part_time">Part-time</Option>
              <Option value="contract">Contract</Option>
              <Option value="freelancer">Freelancer</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="salary"
            label="Current Salary"
            rules={[{ required: true, message: "Please enter salary!" }]}
          >
            <Input type="number" placeholder="Enter current salary" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Profile Picture</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="image" label="Upload Image">
            <Upload
              listType="picture"
              beforeUpload={() => false} // Prevent auto upload
              onChange={handleImageChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          {imageUrl && <Image width={100} src={imageUrl} alt="Profile Preview" />}
        </Col>
      </Row>

      {/* Conditionally render CustomFields if provided */}
      {CustomFields && (
        <CustomFields record={record} module={record ? `user-edit` : `user-add`} />
      )}

     
<Form.Item>
  <Row justify="end">
    <Button type="primary" htmlType="submit" loading={loading}>
      {isEditing ? "Update" : "Create"}
    </Button>
  </Row>
</Form.Item>

    </Form>
  );
}
