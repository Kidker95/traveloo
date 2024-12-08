import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { vacationService } from '../../../Services/VacationService';
import { notify } from '../../../Utils/Notify';
import { chartUtil } from '../../../Utils/ChartUtil';
import './LikesChart.css';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function LikesChart(): JSX.Element {
    const [chartData, setChartData] = useState<any>(null);
    const [chartOptions, setChartOptions] = useState<any>(null);

    useEffect(() => {
        async function fetchLikesData() {
            try {
                const likesReport = await vacationService.getLikesCount();
    
                // Extract labels (destinations) and data (likes count)
                const labels = likesReport.map(item => item.destination);
                const data = likesReport.map(item => item.likesCount);
    
                // Get chart configuration
                const { data: barChartData, options: barChartOptions } = chartUtil.getBarChartConfig(labels, data);
    
                setChartData(barChartData);
                setChartOptions(barChartOptions);
            } catch (err: any) {
                notify.error(err.message || 'Failed to fetch likes report.');
            }
        }
    
        fetchLikesData();
    }, []);
    

    return (
        <div className='chart-container'>
            <div className="BarChart">
                {chartData && chartOptions ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
    );
}