import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(username, password);

    if (success) {
      navigate("/bookpage");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 w-full mb-3"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 w-full"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
