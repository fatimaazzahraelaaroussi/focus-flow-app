from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class MoodEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    energy_level = db.Column(db.Integer, nullable=False)  # 1-10
    focus_level = db.Column(db.Integer, nullable=False)   # 1-10
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'energy_level': self.energy_level,
            'focus_level': self.focus_level,
            'timestamp': self.timestamp.isoformat()
        }

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    energy_required = db.Column(db.Integer, nullable=False)
    focus_required = db.Column(db.Integer, nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    source = db.Column(db.String(50), default='manual')  # ← AJOUT
    external_id = db.Column(db.String(100))  # ← AJOUT

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'duration': self.duration,
            'energy_required': self.energy_required,
            'focus_required': self.focus_required,
            'priority': self.priority,
            'category': self.category,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'source': self.source,  # ← AJOUT
            'external_id': self.external_id  # ← AJOUT
        }