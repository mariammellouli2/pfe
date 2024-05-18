import React from "react";
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import { Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import './SideBar.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const drawerWidth = 240;

const role = localStorage.getItem("role") || "";

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`, // Enclose in backticks for interpolation
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`, // Enclose in backticks for interpolation
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    color: '#0E3A5D',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#0E3A5D' : '#fffff', // Correction ici
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Array1 = [
 
  { "text": "Feuille", "icon": <PendingActionsOutlinedIcon />, "path": "/" },
];
const Array2 = [
  { "text": "Approbation", "icon": <InventoryOutlinedIcon />, "path": "/Approbation" },
  { "text": "Projet", "icon": <BallotOutlinedIcon />, "path": role == "responsable" ? "/projet/responsable" : "/projet" },
   { "text": "client", "icon": <PermContactCalendarOutlinedIcon />, "path": "/Client" }
];
const Array3 = [
  { "text": "Calendrier", "icon": <CalendarMonthIcon />, "path": "/Calendrier" },
  { "text": "Dashboard", "icon": <BarChartOutlinedIcon />, "path": "/Dashboard" }
];

 
const Array4 = [
  { "text": "Parametrage", "icon": <SettingsOutlinedIcon />, "path": "/Parametrage" },
];

const SideBar = () => {
  let location = useLocation();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer style={{position:'relative'}} variant="permanent" open={open}>
      <DrawerHeader />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          marginLeft: 1,
          ...(open && { display: 'none' }),
        }}
      >
        <MenuIcon />
      </IconButton>
     {open && (
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}

      <Avatar sx={{
        mx: "auto",
        width: open ? 88 : 44,
        height: open ? 88 : 44,
        my: 1,
        border: "2px solid grey",
        transition: "0.25s"
      }}
        alt="Remy Sharp"
        src="/static/images/avatar/1.jpg" />
      <Typography align="center" sx={{ fontSize: open ? 17 : 0, transition: "0.25s" }} > mariam mallouli </Typography>
      <Typography align="center" sx={{ fontSize: open ? 14 : 0, transition: "0.25s", color: theme.palette.info.main }} > responsable  </Typography>

      <List>
        {Array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path)
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor :  location.pathname === item.path?  theme.palette.mode === "dark" ? grey[800]: grey[400]  : null 
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Array2.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path)
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor :  location.pathname === item.path?  theme.palette.mode === "dark" ? grey[800]: grey[400]  : null 
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Array3.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path)
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor :  location.pathname === item.path?  theme.palette.mode === "dark" ? grey[800]: grey[400]  : null 
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Array4.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path)
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor :  location.pathname === item.path?  theme.palette.mode === "dark" ? grey[800]: grey[400]  : null 
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideBar;
