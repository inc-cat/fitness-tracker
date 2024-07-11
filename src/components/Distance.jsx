import { useState, useRef } from 'react';
export default function Distance(props) {
  const modeRef = useRef();
  const distanceRef = useRef();

  function dayMerge(stats) {
    const mergedData = {};

    stats.forEach(function (entry) {
      const key = entry.activity + entry.date.slice(0, 10);

      if (!mergedData[key]) {
        mergedData[key] = { ...entry, count: 1 };
      } else {
        for (let val in entry) {
          if (
            val !== 'activity' &&
            val !== 'date' &&
            val !== 'averageKMH' &&
            val !== 'averageMiles'
          ) {
            mergedData[key][val] += entry[val];
          }
        }

        mergedData[key].averageKMH =
          (mergedData[key].averageKMH * mergedData[key].count +
            entry.averageKMH) /
          (mergedData[key].count + 1);
        mergedData[key].averageMiles =
          (mergedData[key].averageMiles * mergedData[key].count +
            entry.averageMiles) /
          (mergedData[key].count + 1);
        mergedData[key].count += 1;
      }
    });

    for (let key in mergedData) {
      delete mergedData[key].count;
    }

    return Object.values(mergedData);
  }

  const modeSubmit = function (event) {
    event.preventDefault();
    const mode = modeRef.current.value;
    const measurement = distanceRef.current.value;
    if (mode === 'biking' && measurement === 'miles') {
      setStatsShowcase(labels.biking.miles);
    } else if (mode === 'biking' && measurement === 'km') {
      setStatsShowcase(labels.biking.km);
    } else if (mode === 'walking' && measurement === 'km') {
      setStatsShowcase(labels.walking.km);
    } else if (mode === 'walking' && measurement === 'miles') {
      setStatsShowcase(labels.walking.miles);
    }
    setExerciseMode(mode);
    setMeasurement(measurement);
  };

  const labels = {
    biking: {
      km: ['Date', 'Distance (Kilometers)', 'Average Speed (km/h)', 'Calories'],
      miles: ['Date', 'Distance (Miles)', 'Average Speed (mph)', 'Calories'],
    },
    walking: {
      km: ['Date', 'Steps', 'Distance (Kilometers)'],
      miles: ['Date', 'Steps', 'Distance (Miles)'],
    },
  };

  const [exerciseMode, setExerciseMode] = useState('biking');
  const [statsShowcase, setStatsShowcase] = useState(labels.biking.km);
  const [measurement, setMeasurement] = useState('km');

  let query = dayMerge(
    props.statistics
      .filter(function (entry) {
        if (exerciseMode === 'combined') {
          return true;
        } else {
          return entry.activity === exerciseMode;
        }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  );

  return (
    <>
      <form onSubmit={modeSubmit}>
        <select name="mode" ref={modeRef}>
          <option value="biking">Cycling</option>
          <option value="walking">Walking</option>
        </select>
        <select name="distance" ref={distanceRef}>
          <option value="km">km</option>
          <option value="miles">Miles</option>
        </select>
        <input type="submit" value="Refresh!"></input>
      </form>
      <table>
        <tr>
          {statsShowcase.map(function (title) {
            {
              return <th>{title}</th>;
            }
          })}
        </tr>
        {query.map(function (entry) {
          console.log(props.statistics);
          if (exerciseMode === 'biking') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>
                  {measurement === 'miles' ? entry.miles : entry.kilometers}
                </td>
                <td>
                  {measurement === 'miles'
                    ? entry.averageMPH
                    : entry.averageKMH}
                </td>
                <td>{entry.calories}</td>
              </tr>
            );
          } else if (exerciseMode === 'walking') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>{entry.steps}</td>
                <td>{measurement === 'km' ? entry.kilometers : entry.miles}</td>
              </tr>
            );
          }
        })}
      </table>
    </>
  );
}
