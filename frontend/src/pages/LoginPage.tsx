import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(username, password);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 
     bg-gradient-to-br from-blue-400 via-indigo-500 to-indigo-700

"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30"
      >
        <h2 className="text-center text-4xl font-extrabold text-white drop-shadow mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-200 mb-8">
          Sign in to access your account
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="text-white font-medium">Username</label>
            <input
              type="text"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-white/30 text-white 
                placeholder-gray-200 border border-white/40 focus:ring-2 
                focus:ring-purple-300 outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-white/30 text-white 
                  placeholder-gray-200 border border-white/40 focus:ring-2 
                  focus:ring-purple-300 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 
              text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="small" /> : "Sign In"}
          </button>

          {/* Register link */}
          <p className="text-center text-gray-200 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
