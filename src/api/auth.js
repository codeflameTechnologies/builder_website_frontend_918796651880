import api from "./axios";


// =====================================================
// STEP 1: SEND LOGIN OTP
// =====================================================
// User email enter karega
// Backend email verify karke OTP send karega
//
// NOTE:
// Yahan token save nahi karna hai,
// kyunki abhi login complete nahi hua hai.
// =====================================================

export const loginAdmin = async (email) => {
  const { data } = await api.post("/auth/login", {
    email,
  });
  console.log(data)
  return data;
};


// =====================================================
// STEP 2: VERIFY LOGIN OTP
// =====================================================
// User OTP enter karega
// Backend OTP verify karega
// Successful verification ke baad JWT token milega
// =====================================================

export const verifyLoginOtp = async (email, otp) => {
  const { data } = await api.post("/auth/verify-otp", {
    email,
    otp,
  });


  // Login successful hone ke baad token save karo
  if (data.token) {
    localStorage.setItem("codeflame_builder_adminToken", data.token);
  }


  // Admin information save karo
  if (data.admin) {
    localStorage.setItem(
      "codeflame_builder_adminInfo",
      JSON.stringify({
        id: data.admin.id,
        name: data.admin.name,
        email: data.admin.email,
        isActive: data.admin.isActive,
      })
    );
  }


  return data;
};


// =====================================================
// LOGOUT
// =====================================================

export const logoutAdmin = () => {
  localStorage.removeItem("codeflame_builder_adminToken");
  localStorage.removeItem("codeflame_builder_adminInfo");
};


// =====================================================
// CHECK LOGIN STATUS
// =====================================================

export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("codeflame_builder_adminToken");
};


// =====================================================
// GET CURRENT ADMIN INFO
// =====================================================

export const getAdminInfo = () => {
  const info = localStorage.getItem("codeflame_builder_adminInfo");

  if (!info) {
    return null;
  }

  try {
    return JSON.parse(info);
  } catch (error) {
    console.error("Invalid admin info:", error);

    localStorage.removeItem("codeflame_builder_adminInfo");

    return null;
  }
};