import { BASE_URL  } from './Helper';
/////get Api dropdown employment-types///
export const employmenttypes  = async () => {
    const response = await fetch(`${BASE_URL}/employment-types`);
    return response;
  };

  /////////////Post APi add New employee //////////
  export const addemployee = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/add-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
        },
        body: JSON.stringify(payload), // Convert payload to JSON string
      });
  
      const result = await response.json(); // Parse response
  
      console.log("Add Employee API Response:", result); // Log data
  
      return result; // Return parsed response
    } catch (error) {
      console.error("Error in addemployee API:", error);
      throw error;
    }
  };
  