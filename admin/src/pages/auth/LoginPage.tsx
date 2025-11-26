import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import logo from "../../assets/image/logo.png";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    const success = await login(username, password);

    if (success) {
      navigate("/bookpage");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-4">
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 w-full max-w-md p-10 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-around items-center ">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Admin Logo" className="w-25 h-25" />
          </div>

          <div className="gap-0 flex flex-col">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white">
              Admin Login
            </h1>
            <p>You can login only role admin</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full p-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} BookNest Admin
        </p>
      </motion.div>
    </div>
  );
}
