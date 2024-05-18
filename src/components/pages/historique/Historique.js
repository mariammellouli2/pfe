import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { historicalData ,rows } from "../feuille/data"; // Importez la fonction d'extraction des données historiques

const useStyles = makeStyles((theme) => ({
  table: {
    // Ajoutez vos styles de table ici
    marginBottom: theme.spacing(2),
  },
  cell: {
    // Ajoutez vos styles de cellule ici
  },
}));

const Historique = () => {
  const classes = useStyles();
  const historicalRows = historicalData(rows); // Appel de la fonction pour extraire les données historiques

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.cell}>Nom</TableCell>
          <TableCell className={classes.cell}>Client</TableCell>
          <TableCell className={classes.cell}>Date d'ajout</TableCell>
          <TableCell className={classes.cell}>Source</TableCell>
          <TableCell className={classes.cell}>Statut</TableCell>
          <TableCell className={classes.cell}>Référence Timesheet</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {historicalRows.map((item) => (
          <TableRow key={item.id}>
            <TableCell className={classes.cell}>{item.nom}</TableCell>
            <TableCell className={classes.cell}>{item.client}</TableCell>
            <TableCell className={classes.cell}>{item.date}</TableCell>
            <TableCell className={classes.cell}>{item.source}</TableCell>
            <TableCell className={classes.cell}>{item.statut}</TableCell>
            <TableCell className={classes.cell}>{item.refTimesheet}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Historique;
