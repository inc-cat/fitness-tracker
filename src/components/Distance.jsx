import { useState } from 'react';
export default function Distance(props) {
  const labels = {
    combined: {
      km: ['Date', 'Distance (Kilometers)', 'Duration (Minutes)'],
      miles: ['Date', 'Distance (Miles)', 'Duration (Minutes)'],
    },
    biking: {
      km: ['Date', 'Distance (Kilometers)', 'Average Speed (km/h)', 'Calories'],
      miles: ['Date', 'Distance (Miles)', 'Average Speed (mph)', 'Calories'],
    },
    walking: {
      km: ['Date', 'Steps', 'Distance (Kilometers)'],
      miles: ['Date', 'Steps', 'Distance (Miles)'],
    },
  };

  let query = props.statistics.filter(function (entry) {
    return entry.activity === 'biking';
  });

  const [statsShowcase, setStatsShowcase] = useState(labels.biking.miles);
  const [test, setTest] = useState(query);

  return (
    <>
      <h1>{props.statistics[0].activity}</h1>
      <table>
        <tr>
          {statsShowcase.map(function (title) {
            {
              return <th>{title}</th>;
            }
          })}
        </tr>
        {test.map(function (entry) {
          return (
            <tr>
              <td>{entry.date}</td>
              <td>{entry.kilometers}</td>
              <td>{entry.averageMPH}</td>
              <td>{entry.calories}</td>
            </tr>
          );
        })}
      </table>
    </>
  );
}
