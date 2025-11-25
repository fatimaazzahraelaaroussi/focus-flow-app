import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MoodHistory({ moodHistory }) {
  if (!moodHistory || moodHistory.energy_levels.length === 0) {
    return <div className="no-data">Aucune donnée d'humeur historique</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution de ton humeur sur 30 jours',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Niveau (1-10)'
        }
      },
    },
  };

  const labels = moodHistory.timestamps.map(ts => {
    const date = new Date(ts);
    return date.toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Énergie ⚡',
        data: moodHistory.energy_levels,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Focus 🎯',
        data: moodHistory.focus_levels,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="mood-history">
      <Line options={options} data={data} />
    </div>
  );
}

export default MoodHistory;