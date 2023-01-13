import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../services/LocalStorageService';
import { useGetLoggedUserQuery, useLogoutUserMutation } from '../services/userAuthApi';
import { unsetUserToken } from '../features/authSlice';
import { unsetUserInfo } from '../features/userSlice';

const UserAccountsCircle = ({name}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = getToken()
  const [logoutUser] = useLogoutUserMutation()

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getInitials = (string) => {
    let names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();
    
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

  const handleLogout = async () => {
    const res = await logoutUser({ token })
    if (res.data.status === "success") {
      dispatch(unsetUserToken({ token: null }))
      dispatch(unsetUserInfo({ id: undefined, email: "", name: "", setting: undefined }))
      removeToken('token')
      navigate('/login')
    }
  }

  return (
    <>
      <div 
        style={{
          display: "inline-block",
          backgroundColor: "gray",
          margin: "10px",
          borderRadius: "50%",
          cursor: "pointer"
        }}
        onClick={handleClick}
      >
        <p 
          style={{
            color: "white",
            display: "table-cell",
            verticalAlign: "middle",
            textAlign: "center",
            textDecoration: "none",
            height: "40px",
            width: "40px",
            fontSize: "15px"
          }}
        >
          {getInitials(name)}
        </p>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/changepassword")}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Change password
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserAccountsCircle