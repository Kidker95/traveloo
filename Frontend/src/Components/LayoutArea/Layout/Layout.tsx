import { Header } from "../Header/Header";
import { Routing } from "../Routing/Routing";
import { Box } from "@mui/material";

export function Layout(): JSX.Element {
    return (
        <Box className="h-screen flex flex-col">
            {/* Header */}
            <Box component="header" className="shadow-lg">
                <Header />
            </Box>


            {/* Main Content */}
            <Box component="main" className="flex-grow p-4 bg-gray-50">
                <Routing />
            </Box>
        </Box>
    );
}
