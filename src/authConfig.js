import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: '61448ccc-91cb-4fb0-aa61-49cf82aa97ad',
        authority: 'https://login.microsoftonline.com/38fd29a8-2f30-4f53-a86e-57b04f5c6fd1',
        redirectUri: "http://localhost:3000"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                console.log(message);
            },
            logLevel: LogLevel.Info,
        }
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
