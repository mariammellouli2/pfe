import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import "./auth.css";
import backgroundImage from './background.png'; // Assurez-vous d'avoir importé votre image SVG correctement
import microsoftLogo from './Mic.png';
const LoginSign = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response && response.account) {
        const userEmail = response.account.username;
        console.log(userEmail);
        const res = await fetch(
          `https://localhost:44352/api/Users/getRoleByUserEmail?email=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!res.ok) {
          throw new Error(
            `Erreur lors de la récupération des rôles : ${res.statusText}`
          );
        }
        const data = await res.json();

        console.log(data)
        if (data && data.role) {
          const currentUser = {
            username: userEmail,
            name: data.displayName,
            role: data.role,
          };
          
          console.log('currentUser.role  '+ currentUser.role);
          localStorage.setItem("role", currentUser.role)
          if (currentUser.role.includes('collaborateur') || currentUser.role.includes('responsable') || currentUser.role.includes('administrateur')) {
            navigate("/feuille", { replace: true });
          } else {
            setError(
              "Rôle inconnu. Veuillez contacter votre administrateur."
            );
          }
        } else {
          setError("Erreur lors de la récupération du rôle de l'utilisateur.");
        }
      }
    } catch (e) {
      console.error("Échec de la connexion:", e);
      setError("La connexion a échoué. Veuillez réessayer.");
    }
  };

  return (
        <div className="landing-page" style={{ backgroundImage: `url(${backgroundImage})` }}> {/* Utilisez des backticks pour l'URL */}
        <div className="right-section">
          <div className="auth-container">
            <button className="button" onClick={handleLogin}>
              <div className="button-content">
                <img src={microsoftLogo} alt="Microsoft Logo" className="microsoft-logo" />
                <span>Continuer avec Microsoft</span>
              </div>
            </button>
          </div>
        </div>
        </div>









  );
};

export default LoginSign;
