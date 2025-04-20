import React from "react";
import { Box, Typography } from "@mui/material";
import ItemPainel from './itemPainel';

export default function PainelFrame({ title, buttons }) {
  return (
    <Box
        sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
        }}
    >
        {title && (
            <Typography variant="h5" align="center" gutterBottom>
                {title}
            </Typography>
        )}
        <Box
            sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
            }}
        >

            {buttons && buttons.map((button, index) => (
                <ItemPainel
                    key={index}
                    icon={button.icon}
                    label={button.label}
                    onClick={button.onClick}
                />
            ))}
        </Box>
    </Box>
  );
}
