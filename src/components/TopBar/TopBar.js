import React, { useState, useEffect } from 'react';
import { AppBar as MuiAppBar, Toolbar, IconButton, InputBase, Box, Stack, Menu, MenuItem } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import SearchIcon from '@mui/icons-material/Search';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import image from './logo1.png';
import NotificationDropdown from './NotificationDropdown'; // Assurez-vous que le chemin est correct

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: theme.palette.mode === 'light' ? '#0E3A5D' : '#ffffff',
}));

const TopBar = () => {
  const [sticky, setSticky] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('currentMode') === 'dark');
  const navigate = useNavigate();
  const { instance } = useMsal();
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      navigate('/Authentification');
    }).catch((e) => {
      console.error('Échec de la déconnexion:', e);
    });
  };
  const handleModeChange = () => {
    const newMode = darkMode ? 'light' : 'dark';
    localStorage.setItem('currentMode', newMode);
    setDarkMode(!darkMode);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar style={{position:"fixed",width:"100%"}} open={sticky}>
      <Toolbar>
        <img src={image} alt="Logo" style={{ height: '55px', width: '200px' }} />
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Rechercher…"
            inputProps={{ 'aria-label': 'search' }}
            sx={{ mr: 10 }}
          />
        </Search>
        <Box flexGrow={1} />
        <Stack direction="row">
          <IconButton onClick={handleModeChange} color="inherit">
            {darkMode ? <LightModeOutlinedIcon sx={{ mr: 1 }} /> : <DarkModeOutlinedIcon sx={{ mr: 1 }} />}
          </IconButton>
          <NotificationDropdown />
          <IconButton color="inherit">
            <SettingsOutlinedIcon sx={{ mr: 1 }} />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <Person2OutlinedIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Paramètres</MenuItem>
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
