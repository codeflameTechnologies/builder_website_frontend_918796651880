import api from "./axios";

export const createEnquiry = async (payload) => {
  const { data } = await api.post("/enquiries", payload);
  return data;
};

export const getEnquiries = async () => {
  const { data } = await api.get("/enquiries");
  return data;
};
