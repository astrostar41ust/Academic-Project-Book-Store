import React, { useEffect, useState } from "react";
import { authAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();

      setUser({
        username: res.username,
        role: res.role?.name ?? res.role, 
      });
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  const handleLogout = () => {
    logout();   
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-5">
      <div className="h-40 w-40 rounded-full overflow-hidden bg-gray-200">
        <img src="https://scontent.fbkk12-6.fna.fbcdn.net/v/t39.30808-6/587995936_2203132776881265_8249596491132280791_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEc5_biUAWu4CEhZtbhcHgUKWjJ341XC_0paMnfjVcL_Vhd2TAvKMh786cyKfj6Vn7t_BEwQKXPeetUxr2pHNDa&_nc_ohc=6_96vkTqf6oQ7kNvwHzv6j-&_nc_oc=AdnRHURTIXLDKRe1T0dZqj4hupjXt8hDgSE7rZjywIzrr1Q1Ysn3YdLBy2sYd7ngYfXkpgFQ1s_eW7NZgpc3-JCd&_nc_zt=23&_nc_ht=scontent.fbkk12-6.fna&_nc_gid=PZ12q5T5t_0HMIhq3rYsYA&oh=00_Afg_pf8cJELfFdr1-xcPoFNTzBxrnJdAQDtMOTCnknyRHw&oe=692CF79D"></img>
      </div>

      {user ? (
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
