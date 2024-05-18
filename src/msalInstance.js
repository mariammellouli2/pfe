// src/auth/msalInstance.js
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig"; // Assurez-vous que le chemin est correct

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;