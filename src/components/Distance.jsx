import { useState, useRef } from 'react';
export default function Distance(props) {
  const modeRef = useRef();
  const distanceRef = useRef();

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

  const [exerciseMode, setExerciseMode] = useState('biking');
  const [statsShowcase, setStatsShowcase] = useState(labels.biking.km);
  const [measurement, setMeasurement] = useState('km');

  let query = props.statistics
    .filter(function (entry) {
      return entry.activity === exerciseMode;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <form onSubmit={modeSubmit}>
        <select name="mode" ref={modeRef}>
          <option value="biking">Cycling</option>
          <option value="walking">Walking</option>
          <option value="">Combined</option>
        </select>
        <select name="distance" ref={distanceRef}>
          <option value="km">km</option>
          <option value="miles">Miles</option>
        </select>
        <input type="submit" value="Refresh!"></input>
      </form>
      <h1>{props.statistics[0].activity}</h1>
      <table>
        <tr>
          {statsShowcase.map(function (title) {
            {
              return <th>{title}</th>;
            }
          })}
        </tr>
        {query.map(function (entry) {
          if (exerciseMode === 'biking' && measurement == 'miles') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>{entry.miles}</td>
                <td>{entry.averageMPH}</td>
                <td>{entry.calories}</td>
              </tr>
            );
          } else if (exerciseMode === 'biking' && measurement == 'km') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>{entry.kilometers}</td>
                <td>{entry.averageKMH}</td>
                <td>{entry.calories}</td>
              </tr>
            );
          } else if (exerciseMode === 'walking' && measurement === 'km') {
            return (
              <tr>
                <td>{entry.date.substring(0, 10)}</td>
                <td>{entry.steps}</td>
                <td>{entry.kilometers}</td>
              </tr>
            );
          } else if (exerciseMode === 'walking' && measurement === 'miles') {
            <tr>
              <td>{entry.date.substring(0, 10)}</td>
              <td>{entry.steps}</td>
              <td>{entry.miles}</td>
            </tr>;
          }
        })}
      </table>
    </>
  );
}
