import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './APP.css';
import MoodHistory from './MoodHistory'; 

function App() {
  const [tasks, setTasks] = useState(null);
  const [currentMood, setCurrentMood] = useState(null);
  const [tempMood, setTempMood] = useState({ energy_level: 5, focus_level: 5 }); // Initialisé par défaut
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [moodHistory, setMoodHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    duration: 30,
    energy_required: 5,
    focus_required: 5,
    priority: 3,
    category: 'technique'
  });

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data.classified_tasks);
      setCurrentMood(response.data.current_mood);
    } catch (error) {
      console.error('Erreur API:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMood = (type, value) => {
    setTempMood(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const saveMood = async () => {
    try {
      setLoading(true);
      await axios.post('/api/mood', {
        energy: tempMood.energy_level,
        focus: tempMood.focus_level
      });
      
      // Recharge les tâches avec la nouvelle humeur
      await fetchTasks();
      
    } catch (error) {
      console.error('Erreur sauvegarde humeur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/tasks', newTask);
      
      // Réinitialise le formulaire
      setNewTask({
        title: '',
        duration: 30,
        energy_required: 5,
        focus_required: 5,
        priority: 3,
        category: 'technique'
      });
      setShowAddTask(false);
      
      // Recharge les tâches
      await fetchTasks();
      
      alert('Tâche ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur ajout tâche:', error);
      alert('Erreur lors de l\'ajout de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const updateNewTask = (field, value) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const completeTask = async (taskId) => {
    try {
      console.log('🔄 Tentative de complétion tâche ID:', taskId);
      setLoading(true);
      
      const response = await axios.put(`/api/tasks/${taskId}/complete`);
      console.log('✅ Réponse API:', response.data);
      
      // Recharge les tâches pour mettre à jour l'affichage
      await fetchTasks();
      
      alert('Tâche marquée comme terminée ! 🎉');
    } catch (error) {
      console.error('❌ Erreur complétion tâche:', error);
      console.error('📋 Message:', error.message);
      console.error('🔢 Status:', error.response?.status);
      console.error('📦 Data:', error.response?.data);
      alert('Erreur lors du marquage de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodHistory = async () => {
    try {
      console.log('🔄 Chargement historique humeur...');
      const response = await axios.get('/api/mood/history');
      console.log('📊 Données reçues:', response.data);
      console.log('📈 Énergies:', response.data.energy_levels);
      console.log('🎯 Focus:', response.data.focus_levels);
      setMoodHistory(response.data);
    } catch (error) {
      console.error('❌ Erreur historique humeur:', error);
      console.error('🔧 Détails:', error.response?.data);
    }
  };

  if (loading && !tasks) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Focus Flow 🧠</h1>
        <p>Ta productivité adaptée à ton humeur</p>
        <div className="header-actions">
          <button 
            onClick={() => {
              setShowHistory(!showHistory);
              if (!showHistory) {
                fetchMoodHistory();
              }
            }} 
            className="history-btn"
          >
            {showHistory ? '📊 Masquer l\'historique' : '📊 Voir l\'historique'}
          </button>
          <button 
            onClick={() => setShowAddTask(true)} 
            className="add-task-btn"
          >
            + Nouvelle Tâche
          </button>
        </div>
      </header>

      {/* SECTION HUMAUR - TOUJOURS AFFICHÉE */}
      <div className="mood-section">
        <h2>Comment te sens-tu maintenant ?</h2>
        <div className="mood-display">
          <div className="mood-slider">
            <label>⚡ Énergie : {tempMood.energy_level}/10</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={tempMood.energy_level}
              onChange={(e) => updateMood('energy_level', parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>😴</span>
              <span>💪</span>
            </div>
          </div>
          
          <div className="mood-slider">
            <label>🎯 Focus : {tempMood.focus_level}/10</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={tempMood.focus_level}
              onChange={(e) => updateMood('focus_level', parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-labels">
              <span>🌀</span>
              <span>🎯</span>
            </div>
          </div>
        </div>
        <button onClick={saveMood} className="save-mood-btn" disabled={loading}>
          {loading ? 'Sauvegarde...' : '💫 Mettre à jour mon état'}
        </button>
        
        {currentMood && (
          <p className="current-mood-info">
            Dernière humeur enregistrée: Énergie {currentMood.energy_level}/10, Focus {currentMood.focus_level}/10
          </p>
        )}
      </div>

      {showHistory && (
        <div className="history-section">
          <h2>📊 Historique de ton humeur</h2>
          <MoodHistory moodHistory={moodHistory} />
          <button 
            onClick={fetchMoodHistory} 
            className="refresh-history-btn"
          >
            🔄 Actualiser
          </button>
        </div>
      )}

      {/* Modal d'ajout de tâche */}
      {showAddTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>➕ Ajouter une nouvelle tâche</h2>
            
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Titre de la tâche *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => updateNewTask('title', e.target.value)}
                  placeholder="Ex: Réviser le code API..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>⏱️ Durée (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={newTask.duration}
                    onChange={(e) => updateNewTask('duration', parseInt(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label>📁 Catégorie</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => updateNewTask('category', e.target.value)}
                  >
                    <option value="technique">Technique</option>
                    <option value="creative">Créatif</option>
                    <option value="admin">Administratif</option>
                    <option value="meeting">Réunion</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>🚨 Priorité</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => updateNewTask('priority', parseInt(e.target.value))}
                  >
                    <option value="1">🚨 Urgent</option>
                    <option value="2">⭐ Important</option>
                    <option value="3">📅 Planifié</option>
                    <option value="4">💡 Idée</option>
                    <option value="5">🌱 Optionnel</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>⚡ Énergie requise: {newTask.energy_required}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newTask.energy_required}
                    onChange={(e) => updateNewTask('energy_required', parseInt(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="form-group">
                  <label>🎯 Focus requis: {newTask.focus_required}/10</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newTask.focus_required}
                    onChange={(e) => updateNewTask('focus_required', parseInt(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddTask(false)}>
                  Annuler
                </button>
                <button type="submit" disabled={!newTask.title.trim() || loading}>
                  {loading ? 'Ajout...' : 'Créer la tâche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks ? (
        <div className="tasks-container">
          {/* Tâches Recommandées */}
          <div className="task-category recommended">
            <h2>🎯 RECOMMANDÉ MAINTENANT</h2>
            {tasks["🎯 RECOMMANDÉ MAINTENANT"] && tasks["🎯 RECOMMANDÉ MAINTENANT"].length === 0 ? (
              <p className="no-tasks">Aucune tâche recommandée pour le moment</p>
            ) : (
              tasks["🎯 RECOMMANDÉ MAINTENANT"]?.map(task => (
                <TaskCard key={task.id} task={task} onComplete={completeTask} />
              )) || <p className="no-tasks">Chargement...</p>
            )}
          </div>

          {/* Tâches À Considérer */}
          <div className="task-category later">
            <h2>💡 À CONSIDÉRER</h2>
            {tasks["💡 À CONSIDÉRER"] && tasks["💡 À CONSIDÉRER"].length === 0 ? (
              <p className="no-tasks">Aucune tâche à considérer</p>
            ) : (
              tasks["💡 À CONSIDÉRER"]?.map(task => (
                <TaskCard key={task.id} task={task} onComplete={completeTask} />
              )) || <p className="no-tasks">Chargement...</p>
            )}
          </div>

          {/* Tâches Pas Maintenant */}
          <div className="task-category not-now">
            <h2>💤 PAS MAINTENANT</h2>
            {tasks["💤 PAS MAINTENANT"] && tasks["💤 PAS MAINTENANT"].length === 0 ? (
              <p className="no-tasks">Aucune tâche déconseillée</p>
            ) : (
              tasks["💤 PAS MAINTENANT"]?.map(task => (
                <TaskCard key={task.id} task={task} onComplete={completeTask} />
              )) || <p className="no-tasks">Chargement...</p>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">
          <p>Chargement des tâches...</p>
          <button onClick={fetchTasks}>Rafraîchir</button>
        </div>
      )}
    </div>
  );
}

// Composant pour afficher une tâche avec bouton de complétion
function TaskCard({ task, onComplete }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-header-actions">
          <span className="priority-label">Priorité: {task.priority}/5</span>
          <button 
            onClick={() => onComplete(task.id)}
            className="complete-btn"
            title="Marquer comme terminé"
          >
            ✓
          </button>
        </div>
      </div>
      
      <div className="task-details">
        <div className="task-meta">
          <span>⏱️ {task.duration}min</span>
          <span>📁 {task.category}</span>
        </div>
        
        <div className="task-requirements">
          <div className="requirement">
            <span>⚡ Énergie: {task.energy_required}/10</span>
            <div className="energy-bar">
              <div 
                className="energy-fill" 
                style={{width: `${task.energy_required * 10}%`}}
              ></div>
            </div>
          </div>
          
          <div className="requirement">
            <span>🎯 Focus: {task.focus_required}/10</span>
            <div className="focus-bar">
              <div 
                className="focus-fill" 
                style={{width: `${task.focus_required * 10}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;