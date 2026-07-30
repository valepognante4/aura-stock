import sys
from sqlalchemy import create_engine, inspect, text
from database import engine

try:
    with engine.begin() as conn:
        print("Adding columns...")
        try:
            conn.execute(text("ALTER TABLE users ADD (company_name VARCHAR2(200) DEFAULT 'Mi Empresa' NOT NULL)"))
            print("Added company_name")
        except Exception as e:
            print("Failed to add company_name:", e)

        try:
            conn.execute(text("ALTER TABLE users ADD (company_logo CLOB)"))
            print("Added company_logo")
        except Exception as e:
            print("Failed to add company_logo:", e)
        
    insp = inspect(engine)
    columns = insp.get_columns('users')
    print("Current columns in users table:")
    for col in columns:
        print(f" - {col['name']} ({col['type']})")
except Exception as e:
    print(f'Error: {e}')
