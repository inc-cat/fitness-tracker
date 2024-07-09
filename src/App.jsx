import { useState } from 'react';
import './App.css';
import fitData from './assets/fit_data.json';

function App() {
  const fitnessData = fitData.map(function (entry) {
    if (entry.fitnessActivity === 'biking') {
      let miles = entry.aggregate[2].floatValue * 0.000621371;
      let mph = entry.aggregate[3].floatValue * 2.23694;
      let kmh = entry.aggregate[3].floatValue * 3.6;

      return {
        activity: entry.fitnessActivity,
        duration: entry.aggregate[4].floatValue,
        calories: entry.aggregate[1].floatValue,
        miles: Math.round(miles * 100) / 100,
        kilometers: Math.round(entry.aggregate[2].floatValue / 10) / 100,
        averageMPH: Math.round(mph * 100) / 100,
        averageKMH: Math.round(kmh * 100) / 100,
        date: entry.startTime,
      };
    }
  });

  const [statistics, setStatistics] = useState(fitnessData);

  return <></>;
}

export default App;
