import api from "./axios";

export const getAllProperties = async (listingType) => {
  const params = listingType && listingType !== "all" ? { listingType } : {};
  const { data } = await api.get("/properties", { params });
  return data;
};

export const getPropertyById = async (id) => {
  const { data } = await api.get(`/properties/${id}`);
  return data;
};

export const createProperty = async (property) => {
  const { data } = await api.post("/properties", property);
  return data;
};

export const updateProperty = async (id, property) => {
  const { data } = await api.put(`/properties/${id}`, property);
  return data;
};

export const deleteProperty = async (id) => {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
};
