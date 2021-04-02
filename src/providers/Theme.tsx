import type { Theme } from "@material-ui/core/styles";
import {createContext, ReactChild, useEffect, useState} from "react"
import { lightTheme, darkTheme } from "../theme"

interface ContextInterface {
    themeMode: ThemeMode
    theme: Theme
    toggleThemeMode: () => void
}

const initialValues: ContextInterface = {
    themeMode: 'light',
    theme: lightTheme,
    toggleThemeMode: () => {}
}

const Context = createContext<ContextInterface>(initialValues);

interface Props {
    children: ReactChild
}

function Provider({children}: Props) {
    const [themeMode, setThemeMode] = useState<ThemeMode>(initialValues.themeMode)
    const theme = themeMode === 'light' ? lightTheme : darkTheme
    const toggleThemeMode = () => {
        const newThemeMode = themeMode === 'light' ? 'dark' : 'light'
        setThemeMode(newThemeMode)
        localStorage.setItem('theme', newThemeMode)
    }

    // Detect previously store theme
    useEffect(() => {
        const newThemeMode: ThemeMode = localStorage.getItem('theme') === 'light' ? 'light' : 'dark'

        setThemeMode(newThemeMode)

        window?.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', e => {
        setThemeMode(e?.matches ? "dark" : "light")
        });

        return () => window?.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', e => {
        setThemeMode(e?.matches ? "dark" : "light")
        })

    }, [setThemeMode]);

    return (
        <Context.Provider value={{themeMode, theme, toggleThemeMode}}>{children}</Context.Provider>
    );
}

const AppThemeProvider = {Context, Provider, Consumer: Context.Consumer }

export default AppThemeProvider;
