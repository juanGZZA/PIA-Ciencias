import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get('/auth/profile').then(res => {
      if (mounted) setProfile(res.data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <Box>
      <Typography variant="h4">Profile</Typography>
      {profile ? (
        <Box sx={{ mt: 2 }}>
          <Typography>{profile.name}</Typography>
          <Typography>{profile.email}</Typography>
        </Box>
      ) : (
        <Typography sx={{ mt: 2 }}>No profile loaded</Typography>
      )}
    </Box>
  );
}