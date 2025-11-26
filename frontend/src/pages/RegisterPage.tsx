import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      triggerShake();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      triggerShake();
      return;
    }

    const success = await register(username, email, password);
    if (success) {
      navigate("/login");
    } else {
      setError("Registration failed. Try again.");
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={
          shake
            ? { x: [-10, 10, -10, 10, 0] }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/30"
      >
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-md">
          Create Account
        </h2>
        <p className="text-center text-white/80 mt-2">
          Join us and start your journey 🚀
        </p>

        {/* ERROR */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="text-white font-medium">Username</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:ring-2 focus:ring-white/80 outline-none"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:ring-2 focus:ring-white/80 outline-none"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white font-medium">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="mt-1 w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:ring-2 focus:ring-white/80 outline-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-4 top-4 text-white/80"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                className="mt-1 w-full p-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:ring-2 focus:ring-white/80 outline-none"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute right-4 top-4 text-white/80"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="small" /> : "Create Account"}
          </button>

          {/* Link to Login */}
          <p className="text-center text-white mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline hover:text-gray-200"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
