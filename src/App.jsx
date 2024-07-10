import { useState } from 'react';
import './App.css';
import fitData from './assets/fit_data.json';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Distance from './components/Distance';

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
    } else if (entry.fitnessActivity === 'walking') {
      let milesWalked = entry.aggregate[3].floatValue * 0.000621371;
      let kmWalked = entry.aggregate[3].floatValue * 0.001;

      return {
        activity: entry.fitnessActivity,
        steps: entry.aggregate[2].intValue,
        duration: entry.aggregate[5].intValue,
        kilometers: Math.round(kmWalked * 100) / 100,
        miles: Math.round(milesWalked * 100) / 100,
      };
    }
  });

  const [statistics, setStatistics] = useState(fitnessData);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Distance statistics={statistics} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
