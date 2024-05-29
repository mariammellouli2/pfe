export const rows = [
  {
    id: 1,
    Projet: "Projet A",
    Client: "Client A",
    Prestation: "Prestation A",
    Source: "Source A",
    Type_prestation: "Facturable",
    Statut: "En cours",
    Temps_estimer: "10",
    Lundi: "",
    Mardi: "",
    Mercredi: "",
    Jeudi: "",
    Vendredi: "",

  },
  {
    id: 2,
    Projet: "Projet B",
    Client: "Client B",
    Prestation: "Prestation B",
    Source: "Source B",
    Type_prestation: "Non Facturable",
    Statut: "Terminée",
    Temps_estimer: "15",
    Lundi: "",
    Mardi: "",
    Mercredi: "",
    Jeudi: "",
    Vendredi: "",

  },
];
export const historicalData = (data) => {
  // Logique pour extraire les données historiques
  return data.map((item) => ({
    id: item.id,
    nom: item.Projet || item.Prestation, // Utilisez le nom du projet ou de la prestation selon votre logique
    client: item.Client,
    date: new Date().toLocaleDateString(), // Exemple de date actuelle
    source: item.Source,
    statut: item.Statut,
    refTimesheet: `TS-${item.id}`, // Exemple de référence de timesheet
  }));
};



