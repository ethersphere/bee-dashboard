import React from 'react'
import { Paper, Container, TextField, Typography } from '@material-ui/core';

export default function Settings() {
    return (
        <div>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Settings
                </Typography>
                <Paper>
                    <TextField
                    id="filled-full-width"
                    label="API Endpoint"
                    style={{ margin: 0 }}
                    placeholder="ex: 127.0.0.0.1:1633"
                    helperText="Enter node host override / port"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    />
                </Paper>
                <Paper style={{marginTop:'20px'}}>
                    <TextField
                    id="filled-full-width"
                    label="Debug API Endpoint"
                    style={{ margin: 0 }}
                    placeholder="ex: 127.0.0.0.1:1635"
                    helperText="Enter node debug host override / port"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    />
                </Paper>
            </Container>
        </div>
    )
}
