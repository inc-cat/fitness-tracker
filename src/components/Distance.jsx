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
            val !== 'averageMPH'
          ) {
            mergedData[key][val] += entry[val];
          }
        }

        mergedData[key].averageKMH =
          (mergedData[key].averageKMH * mergedData[key].duration +
            entry.averageKMH) /
          (mergedData[key].duration + entry.duration);
        mergedData[key].averageMPH =
          (mergedData[key].averageMPH * mergedData[key].duration +
            entry.averageMPH) /
          (mergedData[key].duration + entry.duration);
        mergedData[key].count += 1;
        mergedData[key].duration += entry.duration;
      }
    });

    for (let key in mergedData) {
      delete mergedData[key].count;
    }

    return Object.values(mergedData).map(function (data) {
      return {
        activity: data.activity,
        averageKMH: data.averageKMH.toFixed(2),
        averageMPH: data.averageMPH.toFixed(2),
        calories: data.calories.toFixed(2),
        date: data.date,
        duration: data.duration,
        kilometers: data.kilometers.toFixed(2),
        miles: data.miles.toFixed(2),
      };
    });
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
      km: [
        'Date',
        'Distance (Kilometers)',
        'Average Speed (km/h)',
        'Calories',
        'Duration (minutes)',
      ],
      miles: [
        'Date',
        'Distance (Miles)',
        'Average Speed (mph)',
        'Calories',
        'Duration (minutes)',
      ],
    },
    walking: {
      km: ['Date', 'Steps', 'Distance (Kilometers)', 'Duration (minutes)'],
      miles: ['Date', 'Steps', 'Distance (Miles)', 'Duration (minutes)'],
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
                <td>{entry.duration}</td>
              </tr>
            );
          } else if (exerciseMode === 'walking') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>{entry.steps}</td>
                <td>{measurement === 'km' ? entry.kilometers : entry.miles}</td>
                <td>{entry.duration}</td>
              </tr>
            );
          }
        })}
      </table>
    </>
  );
}
