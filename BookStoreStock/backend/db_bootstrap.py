import logging

from sqlalchemy import text
from sqlalchemy.exc import DatabaseError

from database import engine

logger = logging.getLogger("aurastock")


def ensure_product_id_sequence() -> None:
    """Oracle requiere la secuencia explícita si la tabla ya existía sin ella."""
    ddl = """
    DECLARE
      v_count NUMBER;
    BEGIN
      SELECT COUNT(*) INTO v_count
      FROM user_sequences
      WHERE sequence_name = 'PRODUCT_ID_SEQ';

      IF v_count = 0 THEN
        EXECUTE IMMEDIATE 'CREATE SEQUENCE product_id_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
      END IF;
    END;
    """
    try:
        with engine.begin() as connection:
            connection.execute(text(ddl))
    except DatabaseError as exc:
        logger.warning("No se pudo verificar/crear product_id_seq: %s", exc)
