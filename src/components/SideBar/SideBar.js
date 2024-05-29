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
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import { Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Import images
import mariamImage from './mariam.jpg';
import mahmoudImage from './mahmoud.jpg';

const drawerWidth = 240;

const role = localStorage.getItem("role") || "";
const userInfo = JSON.parse(localStorage.getItem("currentUser"));

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.mode === 'light' ? '#0E3A5D' : '#ffffff',
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
  { "text": "Feuille", "icon": <PendingActionsOutlinedIcon />, "path": "/feuille" },
];
const Array2 = [
  { "text": "Approbation", "icon": <InventoryOutlinedIcon />, "path": role === "responsable" ? "/Approbation/Responsable" : "/Approbation/Collaborateur" },
  { "text": "Projet", "icon": <BallotOutlinedIcon />, "path": role === "responsable" ? "/projet/Responsable" : "/projet/Collaborateur" },
  { "text": "Client", "icon": <PermContactCalendarOutlinedIcon />, "path": role === "responsable" ? "/Client/responsable" : "Client/Collaborateur" }
];
const Array3 = [
  { "text": "Calendrier", "icon": <CalendarMonthIcon />, "path": "/Calendrier" },
];

if (role === "responsable") {
  Array3.push({ "text": "Dashboard", "icon": <BarChartOutlinedIcon />, "path": "/Dashboard" });
}
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

  const getAvatarSrc = () => {
    if (userInfo?.email === "mallouli.mariam@isimsf.u-sfax.tn") {
      return mariamImage;
    } else if (userInfo?.email === "mahmoud@example.com") {
      return mahmoudImage;
    }
    return mariamImage; // Default photo path
  };

  return (
    <Drawer style={{ position: 'relative' }} variant="permanent" open={open}>
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
      <Avatar
        sx={{
          mx: "auto",
          width: open ? 100 : 55, // Augmenter la taille
          height: open ? 100 : 55, // Augmenter la taille
          my: 1,
          transition: "0.25s",
          '& img': {
            objectFit: 'contain', // Assure que l'image est ajustée sans être coupée
            width: '100%', // S'assure que l'image prend toute la largeur de l'avatar
            height: '100%', // S'assure que l'image prend toute la hauteur de l'avatar
          }
        }}
        alt={userInfo?.name}
        src={getAvatarSrc()}
      />
      <Typography align="center" sx={{ fontSize: open ? 17 : 0, transition: "0.25s", fontFamily: 'Roboto, sans-serif' }} > {userInfo?.name} </Typography>
      <Typography align="center" sx={{ fontSize: open ? 14 : 0, transition: "0.25s", color: theme.palette.info.main, fontFamily: 'Roboto, sans-serif' }} > {role} </Typography>
      <List>
        {Array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: location.pathname === item.path ? '#E3E4E3' : null,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#0E3A5D' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, fontFamily: 'Roboto, sans-serif' }} />
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
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: location.pathname === item.path ? '#E3E4E3' : null,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#0E3A5D' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, fontFamily: 'Roboto, sans-serif' }} />
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
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: location.pathname === item.path ? '#E3E4E3' : null,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#0E3A5D' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, fontFamily: 'Roboto, sans-serif' }} />
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
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor: location.pathname === item.path ? '#E3E4E3' : null,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? '#0E3A5D' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, fontFamily: 'Roboto, sans-serif' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
