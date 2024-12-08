import { Button, Container, Box } from "@mui/material";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import { LikesChart } from "../../VacationsArea/LikesChart/LikesChart";
import DownloadIcon from "@mui/icons-material/Download";
import "./ManagerPage.css";

export function ManagerPage(): JSX.Element {
    useTitle("Manager Page | Traveloo");

    const downloadCsv = async () => {
        try {
            const csvBlob = await vacationService.getCsvLikesReport();

            // Create a Blob URL
            const blobUrl = window.URL.createObjectURL(csvBlob);

            // Create an anchor element
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = "vacation_likes_report.csv"; // Set the filename

            // Trigger the download
            anchor.click();

            // Cleanup
            window.URL.revokeObjectURL(blobUrl);
        } catch (err: any) {
            notify.error(err.message || "Failed to download CSV report");
        }
    };

    return (
        <Container maxWidth="md" className="ManagerPage">
            <Box className="manager-container">
                {/* Chart Section */}
                <Box className="chart-container">
                    <LikesChart />
                </Box>

                {/* Download Button */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={downloadCsv}
                    className="download-btn"
                >
                    Download CSV Report
                </Button>
            </Box>
        </Container>
    );
}
