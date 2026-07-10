from sqlalchemy import text


def execute_query(engine, sql):
    """
    Execute a validated SQL query and return the results.
    """

    with engine.connect() as connection:

        result = connection.execute(text(sql))

        columns = result.keys()

        rows = result.fetchall()

        return [
            dict(zip(columns, row))
            for row in rows
        ]