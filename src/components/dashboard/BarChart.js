import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '',
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function BarChart({results, owner, setOwner}) {

  //const [age, setAge] = useState('');

  const handleChange = (event) => {
    setOwner(event.target.value);
  };

  // Divide the array into two based on year
  let data2022 = results.filter(item => Object.keys(item)[0].includes("2022"));
  let data2023 = results.filter(item => Object.keys(item)[0].includes("2023"));

  // Create an array of all months
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Add missing months with a value of 0 for 2022
  months.forEach(month => {
      if (!data2022.some(item => Object.keys(item)[0].includes(month))) {
          data2022.push({ [`${month}-2022`]: 0 });
      }
  });

  // Add missing months with a value of 0 for 2023
  months.forEach(month => {
      if (!data2023.some(item => Object.keys(item)[0].includes(month))) {
          data2023.push({ [`${month}-2023`]: 0 });
      }
  });

  // Sort the array of objects by earliest month for 2022
  data2022.sort((a, b) => {
      let aMonth = Object.keys(a)[0].split("-")[0];
      let bMonth = Object.keys(b)[0].split("-")[0];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
  });

  // Sort the array of objects by earliest month for 2023
  data2023.sort((a, b) => {
      let aMonth = Object.keys(a)[0].split("-")[0];
      let bMonth = Object.keys(b)[0].split("-")[0];
      return months.indexOf(aMonth) - months.indexOf(bMonth);
  });

  // Push the object values in an array
  let values2022 = data2022.map(item => Object.values(item)[0]);
  let values2023 = data2023.map(item => Object.values(item)[0]);

  let data = {
    labels,
    datasets: [
      {
        label: '2022',
        data: values2022,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '2023',
        data:  values2023,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return <>
    <Typography variant="h7"><b>Products Total Sales ($)</b></Typography>
    <div style={{ width: "50%", float: "right"}}>
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label">Products Total Sales ($)</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={owner}
          // label="Products Total Sales ($)"
          onChange={handleChange}
          size="small"
          sx={{borderRadius: "30px"}}
        >
          <MenuItem value="allusers">All Users</MenuItem>
          <MenuItem value="mine">Mine</MenuItem>
        </Select>
      </FormControl>
    </div>
    <Bar options={options} data={data} />
  
  </>;
}