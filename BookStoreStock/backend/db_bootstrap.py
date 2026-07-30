import logging

from sqlalchemy import text
from sqlalchemy.exc import DatabaseError

from database import engine

logger = logging.getLogger("aurastock")


def ensure_oracle_sequences() -> None:
    """Crea secuencias de Oracle si faltan y las alinea con el MAX(id) de cada tabla."""
    ddl = """
    DECLARE
      v_count NUMBER;
      v_start NUMBER;
    BEGIN
      SELECT COUNT(*) INTO v_count
      FROM user_sequences
      WHERE sequence_name = 'PRODUCT_ID_SEQ';

      IF v_count = 0 THEN
        BEGIN
          EXECUTE IMMEDIATE 'SELECT NVL(MAX(id), 0) + 1 FROM products' INTO v_start;
        EXCEPTION
          WHEN OTHERS THEN
            v_start := 1;
        END;
        EXECUTE IMMEDIATE
          'CREATE SEQUENCE product_id_seq START WITH ' || v_start ||
          ' INCREMENT BY 1 NOCACHE NOCYCLE';
      END IF;

      SELECT COUNT(*) INTO v_count
      FROM user_sequences
      WHERE sequence_name = 'USER_ID_SEQ';

      IF v_count = 0 THEN
        BEGIN
          EXECUTE IMMEDIATE 'SELECT NVL(MAX(id), 0) + 1 FROM users' INTO v_start;
        EXCEPTION
          WHEN OTHERS THEN
            v_start := 1;
        END;
        EXECUTE IMMEDIATE
          'CREATE SEQUENCE user_id_seq START WITH ' || v_start ||
          ' INCREMENT BY 1 NOCACHE NOCYCLE';
      END IF;
    END;
    """
    with engine.begin() as connection:
        connection.execute(text(ddl))
    logger.info("Secuencias Oracle verificadas: product_id_seq, user_id_seq.")


def ensure_user_company_columns() -> None:
    """Agrega columnas de empresa a users si la tabla ya existía sin ellas."""
    ddl = """
    DECLARE
      v_count NUMBER;
    BEGIN
      SELECT COUNT(*) INTO v_count
      FROM user_tab_columns
      WHERE table_name = 'USERS' AND column_name = 'COMPANY_NAME';

      IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE users ADD (company_name VARCHAR2(200) DEFAULT ''Mi Empresa'' NOT NULL)';
      END IF;

      SELECT COUNT(*) INTO v_count
      FROM user_tab_columns
      WHERE table_name = 'USERS' AND column_name = 'COMPANY_LOGO';

      IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'ALTER TABLE users ADD (company_logo CLOB)';
      END IF;
    END;
    """
    with engine.begin() as connection:
        connection.execute(text(ddl))
    logger.info("Columnas de empresa verificadas en users.")


def ensure_product_id_sequence() -> None:
    """Alias retrocompatible."""
    ensure_oracle_sequences()


def ensure_product_user_column() -> None:
    """
    Agrega la columna user_id a la tabla products si todavía no existe.
    Asigna un usuario por defecto (el primer user registrado) a los
    productos huérfanos para no violar constraints futuras.
    """
    ddl = """
    DECLARE
      v_count  NUMBER;
      v_uid    NUMBER := NULL;
    BEGIN
      -- 1) Añadir columna user_id si no existe
      SELECT COUNT(*) INTO v_count
      FROM user_tab_columns
      WHERE table_name = 'PRODUCTS' AND column_name = 'USER_ID';

      IF v_count = 0 THEN
        EXECUTE IMMEDIATE
          'ALTER TABLE products ADD (user_id NUMBER(10) DEFAULT NULL)';
      END IF;

      -- 2) Asignar el primer usuario a productos sin dueño
      BEGIN
        SELECT id INTO v_uid FROM (
          SELECT id FROM users ORDER BY id ASC
        ) WHERE ROWNUM = 1;
      EXCEPTION
        WHEN NO_DATA_FOUND THEN v_uid := NULL;
      END;

      IF v_uid IS NOT NULL THEN
        EXECUTE IMMEDIATE
          'UPDATE products SET user_id = ' || v_uid ||
          ' WHERE user_id IS NULL';
        EXECUTE IMMEDIATE 'COMMIT';
      END IF;
    END;
    """
    with engine.begin() as connection:
        connection.execute(text(ddl))
    logger.info("Columna user_id verificada/agregada en products.")
