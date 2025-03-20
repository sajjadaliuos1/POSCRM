// components/UserForm.js
import React, { useState, useEffect } from "react";
import { Divider, Row, Col, Form, Input, Select, Upload, Button, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { employmenttypes, addemployee } from "../../Api/User";

const { Option } = Select;

export default function UserForm({ record, CustomFields }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);

  // Fetch Employee Types
  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        setLoading(true);
        const response = await employmenttypes();
        console.log("Employment types API response:", response);
  
        // Check if the response has the types array
        if (response && response.types && Array.isArray(response.types)) {
          setEmployeeTypes(response.types);
        } else {
          console.warn("Unexpected response structure:", response);
          setEmployeeTypes([]);
        }
      } catch (error) {
        console.error("Error fetching employment types:", error);
        message.error("Failed to load employee types");
        setEmployeeTypes([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEmployeeTypes();
  }, []);

  // Set initial form values if record exists
  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
      if (record.image) {
        setImageUrl(record.image);
      }
    }
  }, [record, form]);

  // Image Upload Handling
  const beforeUpload = (file) => {
    console.log("beforeUpload triggered with file:", file.name);
    
    // Check file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    
    // Check file size
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);

    return false; // Prevent automatic upload
  };

  
 // Handle Form Submission
const handleSubmit = async (values) => {
  console.log("Form submitted with values:", values);

  setLoading(true);
  try {
    const formData = new FormData();

    // Add all form fields to FormData - safer approach without using hasOwnProperty
    Object.keys(values).forEach(key => {
      if (key !== "image" && values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
        console.log(`Adding ${key}: ${values[key]} to FormData`);
      }
    });

    // Add image file if selected
    if (imageFile) {
      formData.append("image", imageFile);
      console.log("Adding image file to FormData:", imageFile.name);
    }

    // Debug FormData contents
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await addemployee(formData);
    console.log("API Response:", response);

    if (response && response.employee) {
      message.success("Employee created successfully!");
      
      // Reset form after successful submission
      form.resetFields();
      setImageUrl(null);
      setImageFile(null);
    } else {
      throw new Error(response?.message || "Failed to create employee");
    }

    return response;
  } catch (error) {
    console.error("Error submitting form:", error);
    message.error(`Submission failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={record || {}}>
      <Divider orientation="left">Personal Information</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="fullname" label="Full Name" rules={[{ required: true, message: "Please enter full name!" }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="contact" label="Contact" rules={[{ required: true, message: "Please enter contact number!" }]}>
            <Input placeholder="Enter contact number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter address!" }]}>
            <Input.TextArea placeholder="Enter address" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Employment Details</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status!" }]}>
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="on_leave">On Leave</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item
  name="employeeid"
  label="Employee Type"
  rules={[{ required: true, message: "Please select employee type!" }]}
>
  <Select
    placeholder={employeeTypes.length === 0 ? "Loading..." : "Select an employee type"}
    showSearch
    allowClear
    loading={loading}
    filterOption={(input, option) =>
      option?.children?.toLowerCase().includes(input.toLowerCase())
    }
  >
    {employeeTypes.length > 0 ? (
      employeeTypes.flatMap((type, index) => {
        const options = [];
        
        if (type.daily) {
          options.push(
            <Option key={`${type._id || `_id-${index}`}-daily`} value={type.daily}>
              {type.daily}
            </Option>
          );
        }
        
        if (type.monthly) {
          options.push(
            <Option key={`${type._id || `_id-${index}`}-monthly`} value={type.monthly}>
              {type.monthly}
            </Option>
          );
        }
        
        return options;
      })
    ) : (
      <Option disabled key="no-data">
        No data available
      </Option>
    )}
  </Select>
</Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="currentsalary" label="Current Salary" rules={[{ required: true, message: "Please enter salary!" }]}>
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
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          {imageUrl && (
            <Image width={100} src={imageUrl} alt="Profile Preview" />
          )}
          {record?.image && !imageUrl && (
            <Image width={100} src={record.image} alt="Current Profile" />
          )}
        </Col>
      </Row>

      {CustomFields && <CustomFields record={record} module={record ? "user-edit" : "user-add"} />}

      <Form.Item>
        <Row justify="end">
          <Button type="primary" htmlType="submit" loading={loading}>
            {record ? "Update" : "Create"}
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
}