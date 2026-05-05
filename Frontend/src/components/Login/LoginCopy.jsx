import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Building2,
  Lock,
  ShieldCheck,
  User,
  UserPlus,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import loginvid from "../../assets/loginvid.mp4";

const LoginCopy = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!id || !password) {
      setErrorMessage("Please enter both ID and Password");
      toast.error("Please enter both ID and Password");
      return;
    }

    setIsLoading(true);

    try {
      const loginUrl = isAdminLogin
        ? "https://startupbihar.in/api/adminlogin"
        : "https://startupbihar.in/api/userlogin";

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: !isAdminLogin ? id : undefined,
          admin_id: isAdminLogin ? id : undefined,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Login successful");

        localStorage.setItem("token", `Bearer ${data.token}`);

        if (onLogin) onLogin();

        if (!isAdminLogin) {
          localStorage.setItem("registration_no", data.registration_no || "");
          localStorage.setItem("user_id", data.user_id || "");

          navigate("/StartupProfile");
          return;
        }

        const adminRole = data.role || "";

        localStorage.setItem("admin_id", data.admin_id || "");
        localStorage.setItem("admin_name", data.name || "");
        localStorage.setItem("admin_designation", data.designation || "");
        localStorage.setItem("admin_role", adminRole);

        const normalizedRole = String(adminRole).trim().toLowerCase();

        if (
          normalizedRole === "experreviewer" ||
          normalizedRole === "expertreviewer"
        ) {
          navigate("/reviewnewapplication");
        } else {
          navigate("/AdminProfile");
        }
      } else {
        setErrorMessage(data.error || "Login failed");
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginTypeChange = (adminMode) => {
    setIsAdminLogin(adminMode);
    setErrorMessage("");
    setId("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-5">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      >
        <source src={loginvid} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-sky-50/80 to-indigo-100/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.20),transparent_34%),radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_36%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-2xl shadow-slate-300/50 backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-100 via-white to-indigo-100 p-10 text-slate-900 lg:flex">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
            <div className="absolute bottom-0 left-56 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

            <div className="relative">
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  className="h-16 w-auto rounded-2xl bg-white p-2 shadow-md"
                  src="/startup_bihar_logo1.png"
                  alt="Startup Bihar"
                />
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Government of Bihar
                  </p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    Startup Bihar Portal
                  </h1>
                </div>
              </Link>

              <div className="mt-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                   Startup Bihar Portal
                </div>

                <h2 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                  Access your Startup Bihar account securely
                </h2>

                <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                  Existing startups can login using the credentials issued for
                  the new Startup Bihar portal. Admin users can access their
                  assigned account based on their role.
                </p>

                <div className="mt-8 grid gap-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/75 p-4 shadow-sm">
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Startup and admin login from one secure page
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white bg-white/75 p-4 shadow-sm">
                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Role-based redirect for reviewers and administrators
                    </p>
                  </div>
                </div>
              </div>
            </div>

           
          </div>

          <div className="bg-white/95 p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="text-center lg:hidden">
                <Link to="/">
                  <img
                    className="mx-auto h-14 w-auto"
                    src="/startup_bihar_logo1.png"
                    alt="Startup Bihar"
                  />
                </Link>
              </div>

              <div className="mt-4 lg:mt-0">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-sky-600">
                  Portal Login
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select the correct login type before entering your
                  credentials.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => handleLoginTypeChange(false)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    !isAdminLogin
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Startup
                </button>

                <button
                  type="button"
                  onClick={() => handleLoginTypeChange(true)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isAdminLogin
                      ? "bg-white text-sky-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </button>
              </div>

              {errorMessage && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              <form className="mt-7 space-y-5" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="userId"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    {isAdminLogin ? "Admin ID" : "User ID"}
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="userId"
                      name="userId"
                      type="text"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                      placeholder={
                        isAdminLogin ? "Enter Admin ID" : "Enter User ID"
                      }
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition hover:from-sky-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                  {!isLoading && (
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>

              <div className="mt-6 rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white p-3 text-sky-600 shadow-sm">
                    <UserPlus className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950">
                      Searching for new startup application login?
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      For new startup application login, please use the
                      following link.
                    </p>

                    <Link
                      to="/startupregistration"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-indigo-700"
                    >
                      Click here 
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                Use only the credentials issued for the new Startup Bihar
                portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCopy;