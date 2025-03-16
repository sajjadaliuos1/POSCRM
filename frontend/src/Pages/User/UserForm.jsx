import React, { useState, useEffect } from "react"; 
import { Divider, Row, Col, Form, Input, Select, Upload, Button, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { employmenttypes, addemployee } from '../../Api/User';

const { Option } = Select;

export default function UserForm({ record, CustomFields }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeTypes, setEmployeeTypes] = useState([]); 
  const isEditing = !!record;
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null); // Store the actual file

  // Fetch Employee Types from API
  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      try {
        const response = await employmenttypes();
        console.log("Employment types API response:", response);
        
        let result;
        if (typeof response.json === 'function') {
          result = await response.json();
        } else {
          result = response; // Assume it's already parsed
        }
        
        if (Array.isArray(result)) {
          setEmployeeTypes(result);
        } else if (result && typeof result === 'object') {
          const typesArray = result.data || result.types || result.employmentTypes || [];
          setEmployeeTypes(Array.isArray(typesArray) ? typesArray : []);
        } else {
          message.error("Unexpected data format received from API");
        }
      } catch (error) {
        console.error("Error fetching employment types:", error);
        message.error("Failed to load employee types");
      }
    };
  
    fetchEmployeeTypes();
  }, []);

  // Fix: Custom beforeUpload handler
  const beforeUpload = (file) => {
    console.log("beforeUpload triggered with file:", file.name);
    
    // Store the file directly
    setImageFile(file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Return false to prevent auto upload
    return false;
  };

  // Handle Form Submission
  const handleSubmit = async (values) => {
    console.log("Form submission started with values:", values);
    setLoading(true);
    
    try {
      // Create FormData for submission
      const formData = new FormData();
      
      // Add all non-image form values
      Object.keys(values).forEach(key => {
        if (key !== 'image') {
          formData.append(key, values[key]);
          console.log(`Added form field: ${key} = ${values[key]}`);
        }
      });
      
      // Add the image file if we have one
      if (imageFile) {
        formData.append('image', imageFile);
        console.log(`Added image file: ${imageFile.name} (${imageFile.type})`);
      }
      
      console.log("Submitting form data...");
      let response;
      
      if (isEditing) {
        // Update existing employee
        response = await axios.put(`/api/users/${record.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("Update response:", response);
        message.success("Employee updated successfully!");
      } else {
        // Try direct axios call first for better debugging
        try {
          console.log("Making direct API call to create employee");
          response = await axios.post('/api/employees', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          console.log("Direct API response:", response);
        } catch (error) {
          console.log("Direct API call failed, using addemployee function", error);
          // Fall back to the imported function
          response = await addemployee(formData);
          console.log("addemployee response:", response);
        }
        
        message.success("Employee created successfully!");
      }
      
      // Reset form after successful submission for new employee
      if (!isEditing) {
        form.resetFields();
        setImageUrl(null);
        setImageFile(null);
      }
      
      return response;
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(`Submission failed: ${error.message || "Unknown error"}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form 
      form={form}
      layout="vertical" 
      onFinish={handleSubmit}
      initialValues={record || {}}
    >
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
            name="employeeid"
            label="Employee Type"
            rules={[{ required: true, message: "Please select employee type!" }]}
          >
            <Select
              placeholder={employeeTypes.length === 0 ? "Loading..." : "Select an employee type"}
              showSearch
              allowClear
              loading={employeeTypes.length === 0}
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {employeeTypes.length > 0 ? (
                employeeTypes.flatMap((type, index) => {
                  const options = [];
                  
                  if (type.contract) {
                    options.push(
                      <Option key={`${type._id || `id-${index}`}-contract`} value={type.contract}>
                        {type.contract}
                      </Option>
                    );
                  }
                  
                  if (type.daily) {
                    options.push(
                      <Option key={`${type._id || `id-${index}`}-daily`} value={type.daily}>
                        {type.daily}
                      </Option>
                    );
                  }
                  
                  if (type.monthly) {
                    options.push(
                      <Option key={`${type._id || `id-${index}`}-monthly`} value={type.monthly}>
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
          <Form.Item
            name="currentsalary"
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
          {/* Fixed Upload component that doesn't rely on file status */}
          <Form.Item name="image" label="Upload Image" valuePropName="fileList" getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}>
            <Upload
              listType="picture"
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8}>
          {imageUrl && <Image width={100} src={imageUrl} alt="Profile Preview" />}
          {record?.image && !imageUrl && (
            <Image width={100} src={record.image} alt="Current Profile" />
          )}
        </Col>
      </Row>

      {/* Conditionally render CustomFields if provided */}
      {CustomFields && (
        <CustomFields record={record} module={record ? `user-edit` : `user-add`} />
      )}

      <Form.Item>
        <Row justify="end">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
}