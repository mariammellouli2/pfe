import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Input, Spinner, Stack, Text, Box, Alert, AlertIcon } from '@chakra-ui/react';

function Parametrage({ userEmail }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://localhost:44352/api/Users/${encodeURIComponent(userEmail)}`);
        if (response.status === 200) {
          const data = response.data;
          setUserData(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  return (
    <Box p={4} bg="gray.100" borderRadius="md">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        gap={6}
      >
        <Stack spacing={4}>
          <Text fontSize="lg" fontWeight="bold">User Information</Text>
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : userData ? (
            <>
              <Input variant="filled" placeholder="ID" value={userData.id} isReadOnly />
              <Input variant="filled" placeholder="Display Name" value={userData.displayName} isReadOnly />
              <Input variant="filled" placeholder="Email" value={userData.email} isReadOnly />
              <Input variant="filled" placeholder="Role" value={userData.role} isReadOnly />
              <Input variant="filled" placeholder="Group ID" value={userData.groupId} isReadOnly />
            </>
          ) : (
            <Text>No data available</Text>
          )}
        </Stack>
      </Grid>
    </Box>
  );
}

export default Parametrage;
