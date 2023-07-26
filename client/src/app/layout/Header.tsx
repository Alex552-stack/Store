import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
import { ChangeEvent } from "react";

interface Props{
    switchDarkMode: () => void;
}

export default function Header({switchDarkMode}: Props){
    const handleSwitchChange = () => {
        switchDarkMode();
    }
    return(
        <AppBar position = "static" sx = {{mb: 4}}>
            <Toolbar>
                <Typography variant='h6'>
                    RE-STORE
                </Typography>
                <Switch onChange={handleSwitchChange}/>
            </Toolbar>
        </AppBar>
    )
}