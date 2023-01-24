import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({results}) {

  // Sort the array of objects by their values in descending order
  results.sort((a, b) => {
    return Object.values(b)[0] - Object.values(a)[0];
  });

  // Initialize empty arrays to store keys and values
  let keys = [];
  let values = [];

  // Push the keys and values in the separate arrays
  results.forEach(item => {
    keys.push(Object.keys(item)[0]);
    values.push(Object.values(item)[0]);
  });

  let data = {
    labels: keys,
    datasets: [
      {
        label: 'Total sales ($)',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <>
    <Typography variant='h7' ><b>Top Salespersons</b></Typography>
    <Doughnut data={data} />
  </>;
}
