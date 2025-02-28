import { useRef, useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import '../css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState<{ id: number; username: string; email: string; profilePictureUrl: string} | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };
  
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
          if (e.target.files && e.target.files[0]) {
  
              const formData = new FormData();
              formData.append('file', e.target.files[0]); 
  
              const response = await axiosInstance.post('/api/files/upload', formData, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              });
  
              setUser(prevUser => prevUser ? { ...prevUser, profilePictureUrl: response.data } : null);
          }
      } catch (error) {
          console.error('Error uploading file:', error);
      }
  };

  return (
    <div className="user-profile">
      <input 
        type='file'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={handleFileChange}/>
      <img className="profile-img" onClick={triggerFileInput} src={user.profilePictureUrl || ''} alt="Profile" />
      <div className="profile-details">
        <h2>{user.username}</h2>
        <h2>{user.email}</h2>
      </div>
    </div>
  );
};

export default UserProfile;
