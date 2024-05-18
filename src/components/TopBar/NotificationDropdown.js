import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem, Badge } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import * as signalR from '@microsoft/signalr';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Connect to SignalR hub
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44352/api/Notifications")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(err => console.log("Error connecting to SignalR:", err));

    connection.on("ReceiveNotification", message => {
      setNotifications(prevNotifications => [...prevNotifications, { text: message }]);
    });

    // Cleanup connection on unmount
    return () => {
      connection.stop().then(() => console.log("Disconnected from SignalR"));
    };
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleMenuClick} color="inherit">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {notifications.map((notification, index) => (
          <MenuItem key={index} onClick={handleMenuClose}>
            {notification.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationDropdown;
