# Système de priorités clair

PRIORITY_LABELS = {
    1: {"label": "🚨 URGENT", "weight": 12, "description": "Doit être fait aujourd'hui"},      # 10→12
    2: {"label": "⭐ IMPORTANT", "weight": 10, "description": "Important cette semaine"},      # 8→10
    3: {"label": "📅 PLANIFIÉ", "weight": 7, "description": "À faire prochainement"},         # 6→7
    4: {"label": "💡 IDÉE", "weight": 4, "description": "Quand tu as du temps"},              # 4→4 (gardé)
    5: {"label": "🌱 OPTIONNEL", "weight": 2, "description": "Si l'inspiration vient"}        # 2→2 (gardé)
}

# Constantes pour les catégories
CATEGORY_LABELS = {
    "RECOMMENDED": "🎯 RECOMMANDÉ MAINTENANT",
    "CONSIDER": "💡 À CONSIDÉRER", 
    "AVOID": "💤 PAS MAINTENANT"
}

# Templates de tâches prédéfinis
TASK_TEMPLATES = {
    "technique": {
        "energy_required": 8,
        "focus_required": 7,
        "category": "technique",
        "description": "Développement, debugging, revue de code"
    },
    "creative": {
        "energy_required": 5,
        "focus_required": 8, 
        "category": "creative",
        "description": "Brainstorming, conception, architecture"
    },
    "admin": {
        "energy_required": 3,
        "focus_required": 4,
        "category": "admin", 
        "description": "Documentation, emails, réunions"
    },
    "meeting": {
        "energy_required": 4,
        "focus_required": 6,
        "category": "meeting",
        "description": "Réunions, présentations, syncs d'équipe"
    }
}
def classify_tasks(tasks, user_energy, user_focus):
    classified_tasks = {
        "🎯 RECOMMANDÉ MAINTENANT": [],
        "💡 À CONSIDÉRER": [],
        "💤 PAS MAINTENANT": []
    }
    
    for task in tasks:
        energy_gap = task.energy_required - user_energy
        focus_gap = task.focus_required - user_focus
        
        # NOUVELLE LOGIQUE : Pénalité seulement si la tâche demande PLUS que ce que tu as
        # Si tu as de la marge (task demande MOINS), pas de pénalité !
        energy_penalty = max(0, energy_gap)  # Pénalité seulement si écart positif
        focus_penalty = max(0, focus_gap)    # Pénalité seulement si écart positif
        
        # Score de compatibilité (0-10) - seulement les écarts négatifs comptent
        negative_gap_penalty = (energy_penalty + focus_penalty) * 1.2
        compatibility_score = 10 - negative_gap_penalty
        compatibility_score = max(0, compatibility_score)
        
        # Score final pondéré (50% priorité, 50% compatibilité)
        priority_weight = PRIORITY_LABELS[task.priority]["weight"]
        final_score = (priority_weight * 0.5) + (compatibility_score * 0.5)
        
        task_data = {
            **task.to_dict(),
            "priority_label": PRIORITY_LABELS[task.priority]["label"],
            "priority_description": PRIORITY_LABELS[task.priority]["description"],
            "compatibility_score": round(compatibility_score, 1),
            "final_score": round(final_score, 1),
            "energy_gap": energy_gap,  # Maintenant peut être négatif (bonne chose)
            "focus_gap": focus_gap     # Maintenant peut être négatif (bonne chose)
        }
        
        # Classification
        # Classification améliorée - la priorité influence la catégorie
        if final_score >= 7.0 or (final_score >= 6.0 and task.priority <= 2):
            # Soit score très haut, soit tâche importante (priorité 1-2) avec bon score
            classified_tasks["🎯 RECOMMANDÉ MAINTENANT"].append(task_data)
        elif final_score >= 4.5 or (final_score >= 4.0 and task.priority <= 3):
            # Soit score moyen, soit tâche planifiée (priorité 1-3) avec score correct
            classified_tasks["💡 À CONSIDÉRER"].append(task_data)
        else:
            classified_tasks["💤 PAS MAINTENANT"].append(task_data)
    
    # Trier chaque catégorie par score décroissant
    for category in classified_tasks:
        classified_tasks[category].sort(key=lambda x: x['final_score'], reverse=True)
    
    return classified_tasks

def get_task_templates():
    """Retourne les templates disponibles pour le frontend"""
    return TASK_TEMPLATES