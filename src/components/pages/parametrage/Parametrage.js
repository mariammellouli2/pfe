import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import "./ParametragePage.css";
import defaultProfileImage from "./mariam.jpg"; // Default image or the image for roles other than 'collaborateur'
import collaboratorProfileImage from "./mahmoud.jpg"; // Image for 'collaborateur' role

const ParametragePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userInfoFromStorage = JSON.parse(localStorage.getItem("currentUser"));
    setUserInfo(userInfoFromStorage);
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetch(`https://localhost:44352/api/Users/${encodeURIComponent(userInfo.username)}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [userInfo]);

  const profileImage = userData?.role === 'collaborateur' ? collaboratorProfileImage : defaultProfileImage;

  return (
    <div className="parametrage-container">
      {loading ? (
        <Typography variant="h5">Chargement des informations...</Typography>
      ) : (
        <form className="form">
          <div className="logo-container">
            <svg
              viewBox="0 0 113 24"
              height="24"
              width="113"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Contenu du logo */}
            </svg>
          </div>
          <Typography variant="h5" className="title">
            Informations utilisateur
          </Typography>
          <img src={profileImage} alt="Profile" className="profile-image" />
          <br />
          <br />
          {userData && (
            <>
              <Typography className="form-text">
                <strong>Nom d'utilisateur :</strong> {userData.displayName}
              </Typography>
              <Typography className="form-text">
                <strong>Email :</strong> {userData.email}
              </Typography>
              {userData.role && (
                <Typography className="form-text">
                  <strong>Rôle :</strong> {userData.role}
                </Typography>
              )}
              <Typography className="form-text">
                <strong>Identifiant de groupe :</strong> {userData.groupId}
              </Typography>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default ParametragePage;
