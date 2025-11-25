from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, MoodEntry, Task
from config import Config
from utils.prioritization import classify_tasks, get_task_templates, CATEGORY_LABELS


app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Initialisation de la base de données
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    try:
        # Attendre que MySQL soit prêt avant de créer les tables
        db.create_all()
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

@app.route('/')
def hello():
    return jsonify({"message": "Focus Flow API is running!", "version": "1.0"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/mood', methods=['POST'])
def add_mood():
    data = request.json
    mood_entry = MoodEntry(
        energy_level=data.get('energy'),
        focus_level=data.get('focus')
    )
    db.session.add(mood_entry)
    db.session.commit()
    return jsonify({"message": "Mood recorded!", "mood": mood_entry.to_dict()})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    latest_mood = MoodEntry.query.order_by(MoodEntry.timestamp.desc()).first()
    
    if not latest_mood:
        return jsonify({"error": "No mood data available"}), 400

    tasks = Task.query.filter_by(completed=False).all()
    classified_tasks = classify_tasks(tasks, latest_mood.energy_level, latest_mood.focus_level)
    
    return jsonify({
        "classified_tasks": classified_tasks,
        "current_mood": latest_mood.to_dict(),
        "summary": {
            "recommended_now": len(classified_tasks[CATEGORY_LABELS["RECOMMENDED"]]),
            "for_later": len(classified_tasks[CATEGORY_LABELS["CONSIDER"]]),
            "not_now": len(classified_tasks[CATEGORY_LABELS["AVOID"]])
        }
    })

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    task = Task(
        title=data.get('title'),
        duration=data.get('duration'),
        energy_required=data.get('energy_required'),
        focus_required=data.get('focus_required'),
        priority=data.get('priority'),
        category=data.get('category')
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task added!", "task": task.to_dict()})

@app.route('/api/tasks/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.completed = True
    db.session.commit()
    return jsonify({"message": "Task completed!", "task": task.to_dict()})

@app.route('/api/task-templates', methods=['GET'])
def get_templates():
    """Retourne les templates de tâches disponibles"""
    return jsonify(get_task_templates())


@app.route('/api/mood/history', methods=['GET'])
def get_mood_history():
    # Récupère les 30 dernières humeurs
    moods = MoodEntry.query.order_by(MoodEntry.timestamp.desc()).limit(30).all()
    
    history = {
        "timestamps": [mood.timestamp.isoformat() for mood in moods],
        "energy_levels": [mood.energy_level for mood in moods],
        "focus_levels": [mood.focus_level for mood in moods]
    }
    
    return jsonify(history)


if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_ENV') == 'development', host='0.0.0.0', port=5000)