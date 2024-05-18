import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Send } from "@mui/icons-material";
import { rows } from "../feuille/data";

const Donnée = () => {
  const [dataRows, setDataRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.rows);
  };

  const handleTransferData = () => {
    console.log("Transférer les données vers la page Feuille :", selectedRows);
    // Vous pouvez maintenant envoyer selectedRows à la page Feuille
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "Tache", headerName: "Tache", width: 150, align: "center", headerAlign: "center" },
    { field: "Projet", headerName: "Projet", width: 150, align: "center", headerAlign: "center" },
    { field: "Client", headerName: "Client", width: 150, align: "center", headerAlign: "center" },
    { field: "Assignée", headerName: "Assignée", width: 150, align: "center", headerAlign: "center" },
    { field: "Prestation", headerName: "Prestation", width: 150, align: "center", headerAlign: "center" },
    { field: "Source", headerName: "Source", width: 150, align: "center", headerAlign: "center" },
    { field: "Estimer", headerName: "Estimer", width: 100, align: "center", headerAlign: "center" },
  ];

  return (
    <>
      <Typography variant="h6" align="center" style={{ marginBottom: "20px" }}>
        Données
      </Typography>
      <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
        <DataGrid
          rows={dataRows}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onSelectionModelChange={handleSelectionChange}
          components={{
            Toolbar: () => (
              <Toolbar>
                <div style={{ flex: 1 }} />
                <Button variant="contained" onClick={handleTransferData}>Transférer vers Feuille</Button>
              </Toolbar>
            ),
          }}
        />
      </div>
    </>
  );
};

export default Donnée;
