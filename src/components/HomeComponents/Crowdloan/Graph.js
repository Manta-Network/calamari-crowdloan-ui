import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Kusama from 'types/Kusama';
import { useTranslation } from 'react-i18next';
import { Placeholder } from 'semantic-ui-react';
import TableColumnHeader from 'components/Table/TableColumnHeader';
import TableHeaderWrapper from 'components/Table/TableHeaderWrapper';
import TableRow from 'components/Table/TableRow';
import TableRowItem from 'components/Table/TableRowItem';
import config from '../../../config';


const GraphPlaceholder = () => {
    return (
        <div className="py-8">
            <Placeholder fluid>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
                <Placeholder.Line />
            </Placeholder.Paragraph>
            </Placeholder>
        </div>
    )
}

export default function Graph ({ allContributions }) {
    if (!allContributions) {
        return <GraphPlaceholder />
    }

    const dateFormatOptions = { month: 'short', day: 'numeric' };
    const [contributionsByDay, setContributionsByDay] = useState([]);

    useEffect(() => {
      const getContributionsByDay = () => {
        const CROWDLOAN_START_DATE = new Date(config.CROWDLOAN_START_TIMESTAMP);
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const msIntoCrowdloan = new Date() - CROWDLOAN_START_DATE;
        const daysIntoCrowdloan = Math.ceil(msIntoCrowdloan / MS_PER_DAY);
        const crowdloanDays = [...Array(daysIntoCrowdloan).keys()].map((i) => CROWDLOAN_START_DATE.getTime() + (i * MS_PER_DAY));
        const contributionsByDay = crowdloanDays.map(day => ({ day: day, totalContributions: Kusama.zero() }));
        let dayIdx = 0;
        let currentDate = contributionsByDay[dayIdx].date;
        allContributions.forEach(contribution => {
          while (contribution.date > currentDate) {
            dayIdx++;
            currentDate = contributionsByDay[dayIdx].date;
          }
          contributionsByDay[dayIdx].totalContributions = contributionsByDay[dayIdx].totalContributions.add(contribution.amountKSM);
        });
        // Add day before crowdloan so that the graph starts at 0
        const dayBeforeCrowdloan = CROWDLOAN_START_DATE.getTime() - MS_PER_DAY;
        const contributionsZerothDay = { day: dayBeforeCrowdloan, totalContributions: Kusama.zero() };
        setContributionsByDay([contributionsZerothDay, ...contributionsByDay]);
      };
      getContributionsByDay();
    }, [allContributions]);

    const options = {
        animation: false,
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        stacked: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'right'
          }
        },
        elements: { point: { radius: 1, hoverRadius: 2 } }
      };


    const data = contributionsByDay.map((_, i) => contributionsByDay.slice(0, i + 1)
        .reduce((acc, cur) => acc.add(cur.totalContributions), Kusama.zero()))
        .map(kusama => kusama.value.toNumber());

    const graphLabels = contributionsByDay.map(singleDayContributions => {
        const day = new Date(singleDayContributions.day);
        return day.toLocaleDateString('en-US', dateFormatOptions);
    });

    const graphData = {
        labels: graphLabels,
        datasets: [
            {
            label: 'KSM',
            data: data,
            borderColor: 'rgba(233, 109, 43, 1)',
            backgroundColor: 'rgba(233, 109, 43, 1)',
            yAxisID: 'y',
            borderWidth: 1
            }
        ]
    };

    return (
        <div className="py-4 relative graph-line pt-4">
            <span className="absolute right-0">KSM</span>
            <Line data={graphData} options={options} />
        </div>
    );
}