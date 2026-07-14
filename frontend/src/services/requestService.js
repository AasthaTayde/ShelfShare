import axios from "axios";

const API = axios.create({
  baseURL: "https://bookflow-backend-jz01.onrender.com/api",
});

export const createRequest = async (bookId) => {

  const token = localStorage.getItem("token");

  const response = await API.post(
    `/requests/create/${bookId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getMyRequests = async () => {

    const token = localStorage.getItem("token");
  
    const response = await API.get(
      "/requests/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  
  };
  export const updateRequestStatus = async (id, status) => {

    const token = localStorage.getItem("token");
  
    const response = await API.put(
  
      `/requests/${id}`,
  
      { status },
  
      {
  
        headers: {
  
          Authorization: `Bearer ${token}`,
  
        },
  
      }
  
    );
  
    return response.data;
  
  };
  export const getBuyerRequests = async () => {

    const token = localStorage.getItem("token");
  
    const response = await API.get(
      "/requests/buyer",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  
  };