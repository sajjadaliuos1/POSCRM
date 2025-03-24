// Api/User.js
export const getEmployeeTypes = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/employee-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching employment types:", error);
    throw error;
  }
};
//////////////updatestatus//////
export const updateEmployeeStatus = async (userId, status) => {
  console.log("📤 Sending Request:", userId, status); // Debugging log

  try {
    const response = await fetch(`http://localhost:5000/api/employees/${userId}/status`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ status }), // ✅ Ensure 'status' is sent
    });

    console.log("📥 Response Status:", response.status); // Debugging log

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    throw error;
  }
};




/////////////////
export const addemployee = async (formData) => {
  try {
    console.log("FormData contents before sending to API:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Debugging logs
    }

    const response = await fetch(`http://localhost:5000/api/add-employee`, {
      method: "POST",
      body: formData, // No need to set headers; FormData handles it
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Add Employee API Response:", result);
    return result;
  } catch (error) {
    console.error("❌ Error in addemployee API:", error);
    throw error;
  }
};



export const getEmployees = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/employees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const updateEmployee = async (id, formData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
      method: "PUT",
      body: formData, // Send as FormData for file upload
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
      method: "DELETE",
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};