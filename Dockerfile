FROM python:3.9-slim

WORKDIR /app

# Copie le backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

# Port
EXPOSE 5000

# Commande de démarrage
CMD ["python", "app.py"]