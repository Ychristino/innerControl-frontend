import { TextField, Grid, Button } from "@mui/material";

const SearchBar = ({ value, onSearchChange, onSearchClick }) => {
  return (
    <Grid container spacing={2} alignItems="center" mb={2}>
      <Grid item xs={10}>
        <TextField
          fullWidth
          label="Buscar por nome"
          value={value}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" fullWidth onClick={onSearchClick}>
          Buscar
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
