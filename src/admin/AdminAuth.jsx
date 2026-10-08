import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, verifyLoginOtp } from "../api/auth";

export default function AdminAuth() {
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();


  // =====================================================
  // HANDLE EMAIL SUBMIT
  // =====================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
     const res = await loginAdmin(normalizedEmail);
     console.log("OTP sent response:", res);

      // Move to OTP screen
      setStep("otp");

      // Start resend timer
      startResendTimer();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // HANDLE OTP VERIFICATION
  // =====================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");

    const cleanOtp = otp.trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyLoginOtp(
        email.trim().toLowerCase(),
        cleanOtp
      );

      /*
       * The API should return:
       *
       * {
       *   success: true,
       *   token: "...",
       *   admin: {...}
       * }
       */

      if (response?.token) {
        localStorage.setItem("adminToken", response.token);
      }

      navigate("/admin/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // RESEND TIMER
  // =====================================================

  const startResendTimer = () => {
    setResendTimer(60);

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };


  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resendLoading) {
      return;
    }

    setError("");
    setResendLoading(true);

    try {
      await loginAdmin(email.trim().toLowerCase());

      setOtp("");
      startResendTimer();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };


  // =====================================================
  // CHANGE EMAIL
  // =====================================================

  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 relative overflow-hidden px-4 py-10">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-gray-950/95 to-black/95" />

      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-800/30 rounded-full blur-3xl" />

      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />


      {/* Main Container */}
      <div className="relative w-full max-w-md">


        {/* =====================================================
            BRAND
        ===================================================== */}

        <div className="text-center mb-6">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-white"
          >
            ABC <span className="text-amber-400">Builders</span>
          </Link>

          <p className="text-gray-400 text-sm mt-1">
            Admin Portal
          </p>

        </div>


        {/* =====================================================
            AUTH CARD
        ===================================================== */}

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">

          <div className="p-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6">

              <h1 className="text-2xl font-bold text-gray-900">

                {step === "email"
                  ? "Welcome back"
                  : "Verify your email"}

              </h1>


              <p className="text-gray-500 text-sm mt-1">

                {step === "email"
                  ? "Sign in to manage your properties and listings."
                  : `We've sent a 6-digit verification code to ${email}`}

              </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}


            {/* =================================================
                STEP 1 — EMAIL
            ================================================= */}

            {step === "email" && (

              <form
                onSubmit={handleSendOtp}
                className="space-y-5"
              >

                <div>

                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Email Address
                  </label>


                  <div className="relative">

                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="admin@abcbuilders.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none transition-all"
                    />

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      ✉️
                    </span>

                  </div>

                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-blue-900 text-white font-semibold uppercase tracking-wider shadow-lg hover:bg-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >

                  {loading ? (
                    <>
                      <span className="animate-spin">
                        ⟳
                      </span>

                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP →"
                  )}

                </button>

              </form>

            )}


            {/* =================================================
                STEP 2 — OTP
            ================================================= */}

            {step === "otp" && (

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-5"
              >

                <div>

                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                    Verification Code
                  </label>


                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                      setOtp(value);
                      setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="w-full py-3 px-4 text-center text-2xl font-bold tracking-[0.5em] rounded-lg border border-gray-200 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 focus:outline-none transition-all"
                  />


                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP is valid for 5 minutes.
                  </p>

                </div>


                {/* VERIFY BUTTON */}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 rounded-lg bg-blue-900 text-white font-semibold uppercase tracking-wider shadow-lg hover:bg-blue-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >

                  {loading ? (
                    <>
                      <span className="animate-spin">
                        ⟳
                      </span>

                      Verifying...
                    </>
                  ) : (
                    "Verify & Sign In →"
                  )}

                </button>


                {/* RESEND */}

                <div className="text-center text-sm">

                  <span className="text-gray-500">
                    Didn't receive the code?{" "}
                  </span>


                  <button
                    type="button"
                    disabled={resendTimer > 0 || resendLoading}
                    onClick={handleResendOtp}
                    className={`font-semibold ${
                      resendTimer > 0 || resendLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-900 hover:underline"
                    }`}
                  >

                    {resendLoading
                      ? "Sending..."
                      : resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend OTP"}

                  </button>

                </div>


                {/* CHANGE EMAIL */}

                <button
                  type="button"
                  onClick={handleChangeEmail}
                  className="w-full text-sm text-gray-500 hover:text-blue-900 transition-colors"
                >
                  ← Use a different email
                </button>

              </form>

            )}


          </div>

        </div>


        {/* =====================================================
            SECURITY MESSAGE
        ===================================================== */}

        <p className="text-center text-xs text-gray-500 mt-6">
          🔒 Protected admin area — authorized personnel only.
        </p>

      </div>

    </div>
  );

}