FROM python:3.9-slim

WORKDIR /app

# Installer Node.js pour build React
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Copier et build le frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Setup backend
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .

# Copier le build React
COPY --from=0 /app/frontend/dist ./frontend-dist

EXPOSE 5000

CMD ["python", "app.py"]