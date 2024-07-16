import { useState } from 'react';
import './App.css';
import fitData from './assets/fit_data.json';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Distance from './components/Distance';

function App() {
  const fitnessData = fitData.map(function (entry) {
    if (entry.fitnessActivity === 'biking') {
      let distanceIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.distance.delta';
      });

      let speedIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.speed.summary';
      });

      let durationIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.active_minutes';
      });

      let caloriesIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.calories.expended';
      });

      let miles = distanceIndex.floatValue * 0.000621371;
      let mph = speedIndex.floatValue * 2.23694;
      let kmh = speedIndex.floatValue * 3.6;

      return {
        activity: entry.fitnessActivity,
        duration: durationIndex.intValue,
        calories: caloriesIndex.floatValue,
        miles: miles,
        kilometers: distanceIndex.floatValue / 1e3,
        averageMPH: mph,
        averageKMH: kmh,
        date: entry.startTime,
      };
    } else if (entry.fitnessActivity === 'walking') {
      let distanceIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.distance.delta';
      });

      let stepsIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.step_count.delta';
      });

      let durationIndex = entry.aggregate.find(function (ind) {
        return ind.metricName === 'com.google.active_minutes';
      });

      let milesWalked = distanceIndex.floatValue * 0.000621371;
      let kmWalked = distanceIndex.floatValue * 0.001;

      return {
        activity: entry.fitnessActivity,
        steps: stepsIndex.intValue,
        duration: durationIndex.intValue,
        kilometers: Math.round(kmWalked * 100) / 100,
        miles: Math.round(milesWalked * 100) / 100,
        date: entry.startTime,
      };
    }
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Distance statistics={fitnessData} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
