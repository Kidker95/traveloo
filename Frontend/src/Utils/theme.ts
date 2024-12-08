import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#4F46E5", // Tailwind's indigo-600
        },
        secondary: {
            main: "#9333EA", // Tailwind's purple-600
        },
        background: {
            default: "#F9FAFB", // Light gray (matches Tailwind's gray-50)
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        button: {
            textTransform: "none", // Prevent buttons from being uppercase
            fontWeight: 600,       // Slightly bold for emphasis
            fontSize: "1rem",      // Standard button size
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true, // Removes shadow on buttons
            },
            styleOverrides: {
                root: {
                    borderRadius: "8px",          // Rounded corners
                    padding: "8px 16px",         // Default padding
                    boxShadow: "none",           // Disable default shadow
                    "&:hover": {
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle hover shadow
                    },
                },
                containedPrimary: {
                    backgroundColor: "#4F46E5",   // Default primary color
                    color: "#FFFFFF",            // White text
                    "&:hover": {
                        backgroundColor: "#4338CA", // Darker indigo for hover
                    },
                },
                containedSecondary: {
                    backgroundColor: "#9333EA",   // Default secondary color
                    color: "#FFFFFF",            // White text
                    "&:hover": {
                        backgroundColor: "#7E22CE", // Darker purple for hover
                    },
                },
                outlined: {
                    borderColor: "#4F46E5",      // Indigo border for outlined buttons
                    color: "#4F46E5",           // Indigo text
                    "&:hover": {
                        backgroundColor: "rgba(79, 70, 229, 0.08)", // Indigo tint
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
    spacing: 8,
});

export default theme;
