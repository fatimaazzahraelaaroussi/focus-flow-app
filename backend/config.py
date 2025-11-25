import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://app_user:app_password@db/focus_flow'
    SQLALCHEMY_TRACK_MODIFICATIONS = False