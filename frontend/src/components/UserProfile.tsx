import { useRef, useEffect, useState } from "react";
import axiosInstance from "../axios/axios";
import '../css/UserProfile.css';

const UserProfile = () => {

  const [user, setUser] = useState<{ id: number; username: string; email: string; profilePictureUrl: string} | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editState, setEditState] = useState(false);
  const [saveState, setSaveState] = useState(false);

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
  }, [saveState]);

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
  
  const handleEditProfile = async () => {

    try {
        const response = await axiosInstance.put('/auth/update', {
            username: user.username,
            email: user.email,
            profilePictureUrl: user.profilePictureUrl,
          });
          setUser(response.data);
    } catch (error) {
        console.error('Error updating user profile:', error);
    }

  };

  const handleEditState = () => {
    setEditState(!editState);

    if (editState) {
        handleEditProfile();
        setSaveState(true);
    }
  
  }

  return (
    <div className="user-profile">
      <input 
        type='file'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={handleFileChange}/>
      <img className="profile-img" onClick={triggerFileInput} src={user.profilePictureUrl || ''} alt="Profile" />
      <div className="profile-details">
        <div className="user-details">
        <label className="user-label">Username</label>
          {editState ? (
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser(prevUser => prevUser ? { ...prevUser, username: e.target.value } : null)}  
            />
          ) : (
            <label className="user-info">{user.username}</label>
          )}
        </div>
        <div className="user-details">
          <label className="user-label">Email</label>
          {editState ? (
            <input
              type="text"
              value={user.email}
              onChange={(e) => setUser(prevUser => prevUser ? { ...prevUser, email: e.target.value } : null)}  
            />
          ) : (
            <label className="user-info">{user.email}</label>
          )}
        </div>
      </div>
      <button className="edit-profile" onClick={handleEditState}>{editState ?'Save' : 'Edit Profile'}</button>
    </div>
  );
};

export default UserProfile;
