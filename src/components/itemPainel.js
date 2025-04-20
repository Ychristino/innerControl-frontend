import React from "react";
import { Button, Typography, Box } from "@mui/material";

export default function ItemPainel({ icon, label, onClick }) {
  return (
    <Button
      variant="outlined"
      color="info"
      size="large"
      onClick={onClick}
      sx={{
        width: { xs: "100%", sm: "150px", md: "200px" }, // Responsivo
        height: { xs: "80px", sm: "150px", md: "200px" }, // Responsivo
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 1, // Espaço entre o ícone e o label
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20px",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
          }}
        >
            <Typography variant="body1">{label}</Typography>
        </Box>
      </Box>
    </Button>
  );
}
