import { ChartData, ChartOptions } from 'chart.js';
import * as getRandomColors from 'get-random-color-by-kidker'; // my npm :)

class ChartUtil {
    public getBarChartConfig(labels: string[], data: number[]): { data: ChartData<'bar'>, options: ChartOptions<'bar'> } {
        const backgroundColors = labels.map(() => getRandomColors.getRandomRGBA());
        const borderColors = labels.map(() => getRandomColors.getRandomRGB()); 

        const chartData: ChartData<'bar'> = {
            labels,
            datasets: [
                {
                    label: 'Number of Likes',
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    hoverBackgroundColor: borderColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.9)')), //rgb -> rgba with 0.9 in a
                    hoverBorderColor: '#000',
                    hoverBorderWidth: 3,
                },
            ],
        };

        const chartOptions: ChartOptions<'bar'> = {
            responsive: true,
            plugins: {
                legend: {
                    display: false, 
                },
                tooltip: {
                    enabled: false
                },
                title: {
                    display: true,
                    text: 'Vacation Likes',
                    color: '#333',
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Destinations',
                        color: '#666',
                    },
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#333',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Likes',
                        font: {
                            family: 'Roboto, sans-serif',
                            size: 14,
                        },
                        color: '#666',
                    },
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: (value) => value.toString(),
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)',
                        lineWidth: 1,
                    },
                },
            },
        };

        return { data: chartData, options: chartOptions };
    }
}

export const chartUtil = new ChartUtil();
