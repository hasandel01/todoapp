import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios"; // Your axios config

const UserProfile = () => {
  const [user, setUser] = useState<{ id: number; username: string; email: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading user details...</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
