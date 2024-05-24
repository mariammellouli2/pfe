import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  paper: {
    margin: '24px',
    padding: '24px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  table: {
    minWidth: 650,
    backgroundColor: '#fff', // Fond blanc pour le tableau
  },
  tableHead: {
    backgroundColor: '#fff', // Gris pour l'en-tête
  },
  tableHeadCell: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '##fff', // Couleur de fond alternée pour les lignes impaires
    },
  },
  title: {
    marginBottom: '40px',
    color: '#046C92',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    fontFamily: 'Arial, sans-serif',
  },
}));

const ClientTable = () => {
  const classes = useStyles();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:44352/api/Client');
        setClients(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des clients :', error);
      }
    };

    fetchData();
  }, []);

  return (

    <>
          <Typography variant="h4" className={classes.title}>
        Liste des Clients
      </Typography>

    <Paper className={classes.paper}>

      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>ID</TableCell>
            <TableCell className={classes.tableHeadCell}>Nom du Client</TableCell>
            <TableCell className={classes.tableHeadCell}>Adresse Courriel</TableCell>
            <TableCell className={classes.tableHeadCell}>Télèphone</TableCell>
            <TableCell className={classes.tableHeadCell}>Pays</TableCell>
            <TableCell className={classes.tableHeadCell}>Projet</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.clientId} className={classes.tableRow}>
              <TableCell>{client.clientId}</TableCell>
              <TableCell>{client.clientName}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.telephone}</TableCell>
              <TableCell>{client.pays}</TableCell>
              <TableCell>{client.projectName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    </>
  );
};

export default ClientTable;
