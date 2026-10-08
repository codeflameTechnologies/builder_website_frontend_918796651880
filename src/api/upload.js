import api from "./axios";

// files: array of File objects (from <input type="file" multiple />)
export const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { data } = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.urls; // array of Cloudinary image URLs
};
