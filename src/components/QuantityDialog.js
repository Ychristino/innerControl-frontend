import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect } from "react";

export default function QuantityDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
  quantity,
  setQuantity,
}) {
  useEffect(() => {
    if (open) {
      setQuantity(0);
    }
  }, [open, setQuantity]);

  const handleChange = (e) => {
    setQuantity(e.target.value === "" ? 0 : parseInt(e.target.value));
  };

  const increase = () => {
    setQuantity((prev) => parseInt(prev) + 1);
  };

  const decrease = () => {
    setQuantity((prev) => Math.max(parseInt(prev) - 1, 0));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <IconButton onClick={decrease} color="primary">
            <Remove />
          </IconButton>
          <TextField
            label="Quantidade"
            type="number"
            value={quantity}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">QTD</InputAdornment>
              ),
            }}
          />
          <IconButton onClick={increase} color="primary">
            <Add />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="success">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
