import axios from "axios";

const API = "http://localhost:5000/api/notifications";

export const getNotifications = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(API, {

    headers: {

      Authorization: `Bearer ${token}`,

    },

  });

  return response.data;

};
export const markNotificationAsRead = async (id) => {

    const token = localStorage.getItem("token");
  
    const response = await axios.put(
  
      `${API}/${id}/read`,
  
      {},
  
      {
  
        headers: {
  
          Authorization: `Bearer ${token}`,
  
        },
  
      }
  
    );
  
    return response.data;
  
  };