import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Visuals(props) {
  let showStats = {};
  showStats.dates = props.show.map(function (entry) {
    return entry.date.substring(0, 10);
  });
  console.log(showStats);

  const conversion = { km: 'kilometers', miles: 'miles' };

  let activityData = {
    labels: showStats.dates,
    datasets: [
      {
        label: 'Stats',
        data: props.show.map(function (entry) {
          return entry[conversion[props.measurement]];
        }),
        backgroundColor: props.show.map(function (name) {
          return 'rgba(255, 255, 255, 255)';
        }),
      },
    ],
  };

  return (
    <>
      <Bar data={activityData} className="graph" />
    </>
  );
}
