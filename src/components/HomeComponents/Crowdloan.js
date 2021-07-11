import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['1 Oct', '2 Oct', '3 Oct', '4 Oct', '5 Oct', '6 Oct', '7 Oct'],
  datasets: [
    {
      label: 'KSM',
      data: [0, 7, 10, 5, 8, 3, 2],
      borderColor: 'rgba(234, 42, 141, 1)',
      backgroundColor: 'rgba(234, 42, 141, 1)',
      yAxisID: 'y',
      borderWidth: 1
    },
    {
      label: 'KMA',
      data: [8, 12, 3, 3, 2, 3, 6],
      borderColor: 'rgba(233, 109, 43, 1)',
      backgroundColor: 'rgba(233, 109, 43, 1)',
      yAxisID: 'y1',
      borderWidth: 1
    },
  ],
};

const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
    },
  },
};

const Crowdloan = () => {
  return (
    <div className="content-item h-full bg-white calamari-text crowdloan">
      <h1 className="title">The Crowdloan</h1>
      <div className="flex">
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Contributions</p>
          <span className="purple-text text-2xl font-semibold">45,200 KSM</span>
        </div>
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Rewards</p>
          <span className="purple-text text-2xl font-semibold">
            15,450,000 KMA
          </span>
        </div>
      </div>
      <div className="py-4 relative graph-line pt-6">
        <span className="absolute left-0">KSM</span>
        <span className="absolute right-0">KMA</span>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Crowdloan;
