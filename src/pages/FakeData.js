/* eslint-disable comma-dangle */
const contributions = {
  1: [
    {
      date: '7/4/2021',
      KSM: 15,
    },
    {
      date: '7/3/2021',
      KSM: 7,
    },
    {
      date: '7/3/2021',
      KSM: 5,
    },
    {
      date: '7/3/2021',
      KSM: 3,
    },
    {
      date: '7/3/2021',
      KSM: 8,
    },
  ],
  2: [
    {
      date: '7/4/2021',
      KSM: 2,
    },
    {
      date: '7/3/2021',
      KSM: 9,
    },
    {
      date: '7/3/2021',
      KSM: 10,
    },
    {
      date: '7/3/2021',
      KSM: 3,
    },
    {
      date: '7/3/2021',
      KSM: 8,
    },
  ],
  3: [
    {
      date: '7/4/2021',
      KSM: 11,
    },
    {
      date: '7/3/2021',
      KSM: 11,
    },
    {
      date: '7/3/2021',
      KSM: 9,
    },
    {
      date: '7/3/2021',
      KSM: 2,
    },
    {
      date: '7/3/2021',
      KSM: 8,
    },
  ],
  4: [
    {
      date: '7/3/2021',
      KSM: 8,
    },
  ],
};

const graphData = {
  labels: ['1 Oct', '2 Oct', '3 Oct', '4 Oct', '5 Oct', '6 Oct', '7 Oct'],
  datasets: [
    {
      label: 'KSM',
      data: [0, 7, 10, 5, 8, 3, 2],
      borderColor: 'rgba(234, 42, 141, 1)',
      backgroundColor: 'rgba(234, 42, 141, 1)',
      color: 'green',
      yAxisID: 'y',
      borderWidth: 1,
    },
    {
      label: 'KMA',
      data: [8, 12, 3, 3, 2, 3, 6],
      borderColor: 'rgba(233, 109, 43, 1)',
      backgroundColor: 'rgba(233, 109, 43, 1)',
      yAxisID: 'y1',
      borderWidth: 1,
    },
  ],
};

const FakeData = {
  graphData,
  contributions,
};

export default FakeData;
