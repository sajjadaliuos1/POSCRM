import React, { useState, useEffect } from "react";
import {
    Divider,
    Row,
    Col,
    Form,
    Input,
    Select,
    Upload,
    Button,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getEmployeeTypes, addemployee, updateEmployee } from "../../Api/User";

const { Option } = Select;

export default function UserForm({ record, CustomFields,onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const isEditing = Boolean(record); // Correct isEditing check.

    useEffect(() => {
        if (record && employeeTypes.length > 0) {
            form.resetFields(); // Reset before setting new values.
            const selectedType = employeeTypes.find(
                (type) => type.type.toLowerCase() === record.employeetypes.toLowerCase()
            );

            form.setFieldsValue({
                fullname: record.name,
                contact: record.contact,
                address: record.address,
                status: record.status ? "active" : "inactive",
                employeeType: selectedType ? selectedType._id : undefined,
                currentsalary: record.currentsalary,
            });

            if (record.key) {
                setFileList([
                    {
                        uid: "-1",
                        name: "Existing Image",
                        status: "done",
                        url: `http://localhost:5000/api/img/${record.key}`,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields(); // Reset form when record is undefined (add mode)
            setFileList([]);
        }
    }, [record, form, employeeTypes]);

    useEffect(() => {
        const fetchEmployeeTypes = async () => {
            try {
                const types = await getEmployeeTypes();
                setEmployeeTypes(types);
            } catch (error) {
                console.error("Error fetching employment types:", error);
            }
        };

        fetchEmployeeTypes();
    }, []);

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("You can only upload image files!");
                return Upload.LIST_IGNORE;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error("Image must be smaller than 5MB!");
                return Upload.LIST_IGNORE;
            }
            return false;
        },
        fileList,
        onChange: handleImageChange,
        multiple: false,
    };

    const handleSubmit = async (values) => {
      if (fileList.length < 1) {
          message.error("Please upload an image for the employee!");
          return;
      }
  
      setLoading(true);
      const payload = new FormData();
  
      payload.append("fullname", values.fullname || "");
      payload.append("contact", values.contact || "");
      payload.append("address", values.address || "");
      payload.append("status", values.status || "");
      payload.append("employeeType", values.employeeType || "");
      payload.append("currentsalary", values.currentsalary || "");
  
      if (fileList[0]?.originFileObj) {
          payload.append("image", fileList[0].originFileObj);
      }
  
      try {
          let response = isEditing ? await updateEmployee(record.key, payload) : await addemployee(payload); // send the record._id
  
          if (response) {
              message.success(`Employee ${isEditing ? "updated" : "added"} successfully!`);
              form.resetFields();
              setFileList([]);
              if (onSuccess) {
                  onSuccess();
              }
          } else {
              throw new Error(`Employee ${isEditing ? "update" : "addition"} failed.`);
          }
      } catch (error) {
          message.error(error.message || `Failed to ${isEditing ? "update" : "add"} employee.`);
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
            name="fullname"
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
  <Select placeholder="Select employee type" loading={!employeeTypes.length}>
    {employeeTypes.map((type) => (
      <Option key={type._id} value={type._id}>
        {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
      </Option>
    ))}
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
        <Form.Item label="Upload Image">
  <Upload
    {...uploadProps}
    listType="picture-card"
    fileList={fileList} // Ensure this is set correctly
    onChange={handleFileChange}
  >
    {fileList.length < 1 && (
      <div>
        <UploadOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )}
  </Upload>
</Form.Item>

        </Col>
      </Row>

      {CustomFields && (
        <CustomFields record={record} module={record ? "user-edit" : "user-add"} />
      )}

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
