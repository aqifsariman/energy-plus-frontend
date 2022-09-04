import React from 'react';
import styles from './Chart.module.css';
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
import faker from 'faker';

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
      text: 'Activities',
    },
  },
};

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const data = {
  labels,
  datasets: [
    {
      label: 'Chargings',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 50 })),
      backgroundColor: '#1f6361',
    },
  ],
};

function Chart() {
  return (
    <Bar
      options={options}
      data={data}
      width="331px"
      height="300px"
      className={styles.bar}
    />
  );
}

export default Chart;
