import { useState, useRef } from 'react';
import Visuals from './Visuals';
export default function Distance(props) {
  const modeRef = useRef();
  const distanceRef = useRef();
  const startRef = useRef();
  const endRef = useRef();

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
        averageKMH: data.averageKMH?.toFixed(2),
        averageMPH: data.averageMPH?.toFixed(2),
        calories: data.calories?.toFixed(2),
        date: data.date,
        duration: data.duration,
        kilometers: data.kilometers.toFixed(2),
        miles: data.miles.toFixed(2),
        steps: data.steps,
      };
    });
  }

  const modeSubmit = function (event) {
    event.preventDefault();
    const mode = modeRef.current.value;
    const measurement = distanceRef.current.value;
    const dateStart = startRef.current.value;
    let dateEnd = new Date(endRef.current.value);

    dateEnd.setDate(dateEnd.getDate() + 1);
    let newYear = dateEnd.getFullYear();
    let newMonth = String(dateEnd.getMonth() + 1).padStart(2, '0');
    let newDay = String(dateEnd.getDate()).padStart(2, '0');

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
    setStart(dateStart);
    setEnd(new Date(`${newYear}-${newMonth}-${newDay}`));
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
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

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
  ).filter(function (entry) {
    if (!start || !end) {
      return true;
    }
    let date1 = new Date(entry.date);
    let startDate = new Date(start);
    let endDate = new Date(end);

    return startDate < date1 && date1 < endDate;
  });

  let totalKM = 0;
  let totalCalories = 0;
  let totalMiles = 0;
  let totalDuration = 0;
  let dates = [];
  query.forEach(function (entry) {
    totalKM += Number(entry.kilometers);
    totalMiles += Number(entry.miles);
    totalCalories += Number(entry.calories);
    totalDuration += Number(entry.duration);
    dates.push(entry.date.substring(0, 10));
  });

  return (
    <>
      <Visuals mode={exerciseMode} measurement={measurement} show={query} />
      <form onSubmit={modeSubmit}>
        <input type="date" id="start" ref={startRef} />
        <input type="date" id="end" ref={endRef} />
        <br></br>
        <select name="mode" ref={modeRef}>
          <option value="biking">Cycling</option>
          <option value="walking">Walking</option>
        </select>
        <select name="distance" ref={distanceRef}>
          <option value="km">km</option>
          <option value="miles">Miles</option>
        </select>
        <input type="submit" value="Refresh!"></input>
        <br></br>
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
      <p>Total km: {totalKM.toFixed(2)}</p>
      <p>Total miles: {totalMiles.toFixed(2)}</p>
      <p>Total calories: {totalCalories.toFixed(2)}</p>
      <p>Total minutes: {totalDuration}</p>
    </>
  );
}
