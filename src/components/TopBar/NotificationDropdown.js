import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import * as signalR from '@microsoft/signalr';

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44352/api/Notification", {
      withCredentials: true
  })
  .withAutomaticReconnect()
  .build();
    connection.start()
       .then(() => console.log("Connected to SignalR"))
        .catch(err => console.log("Connection error: ", err));

        connection.on("ReceiveNotification", (message) => {
          setNotifications(prev => [...prev, message]);
    });

    return () => {
        connection.stop();
    };
}, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleMenuClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
         
        {notifications.length === 0 ? (
          <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleMenuClose}>
              {notification}
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};

export default NotificationDropdown;
