from database import engine
from sqlalchemy import text

def drop():
    with engine.connect() as conn:
        for t in ["inventory_transactions", "users", "products"]:
            try:
                conn.execute(text(f"DROP TABLE {t} CASCADE CONSTRAINTS"))
                print(f"Dropped {t}")
            except Exception as e:
                print(f"Failed to drop {t}: {e}")
                
        for s in ["user_id_seq", "product_id_seq"]:
            try:
                conn.execute(text(f"DROP SEQUENCE {s}"))
                print(f"Dropped {s}")
            except Exception as e:
                print(f"Failed to drop {s}: {e}")
        conn.commit()

if __name__ == "__main__":
    drop()
