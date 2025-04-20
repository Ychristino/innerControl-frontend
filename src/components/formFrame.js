import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CardActions } from '@mui/material';

export function FormFrame({ title, formData, onSubmit, onCancel }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
                height: '100vh', // Para centralizar verticalmente
            }}
        >
            <Card
                sx={{
                    width: '80%', // 80% da largura da tela
                    // maxWidth: '600px', // Limite máximo
                    boxShadow: 3, // Sombra para destaque
                    borderRadius: 2,
                    padding: 2, // Adicionando padding para não ficar colado
                }}
            >
                <CardContent>
                    {title && (
                        <Typography variant="h6" gutterBottom>
                            {title}
                        </Typography>
                    )}
                    <Box sx={{ '& > :not(style)': { mb: 2 } }}>
                        {formData && formData.map((formField, index) => (
                            <React.Fragment key={index}>{formField}</React.Fragment>
                        ))}
                    </Box>
                </CardContent>
                <CardActions>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        {onCancel && (
                            <Box sx={{ flex: 1, ml: 1 }}> {/* margem à esquerda do botão */}
                                <Button 
                                    fullWidth 
                                    color='error'
                                    onClick={onCancel}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        )}
                        {onSubmit && (
                            <Box sx={{ flex: 1, mr: 1 }}> {/* margem à direita do botão */}
                                <Button 
                                    fullWidth 
                                    color='success' 
                                    onClick={onSubmit}
                                >
                                    Salvar
                                </Button>
                            </Box>
                        )}
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
}