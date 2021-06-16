import React from 'react';
import {Line} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {addDays} from "date-fns";
import {Card, CardHeader} from "../generic/Card";

const data2 = {
    labels: ['1', '2', '3', '4', '5', '6'],

    datasets: [
        {
            label: 'Clicks',
            data: [40, 17, 23, 8, 35, 25, 28],
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
    ],
};

const startDate = new Date(2021, 9, 28);
const data = {
    datasets: [{
        label: 'Clicks',
        data: [{
            x: addDays(startDate, 0),
            y: 40
        }, {
            x: addDays(startDate, 2),
            y: 17
        }, {
            x: addDays(startDate, 4),
            y: 23
        }, {
            x: addDays(startDate, 6),
            y: 8
        }, {
            x: addDays(startDate, 8),
            y: 35
        }, {
            x: addDays(startDate, 10),
            y: 25
        }, {
            x: addDays(startDate, 12),
            y: 28
        }],
        fill: false,

        borderColor: "#34D399",
        backgroundColor: "#34D399",
    }],
};
const options = {
    responsive: true,
    scales: {
        x: {
            type: 'time',
            position: 'bottom',
            ticks: {
                maxRotation: 0
            }
        },
        y: {
            display: true
        }
    }
};

const LineChart = () => (
    <Card borderless>
        <CardHeader>
            Overall Engagement
        </CardHeader>
        <Line data={data} options={options} type="line"/>
    </Card>
);

export default LineChart;
