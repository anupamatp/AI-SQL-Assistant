from sqlalchemy import inspect


def get_table_schema(engine, table_name):
    """
    Return column names of a PostgreSQL table.
    """

    inspector = inspect(engine)

    columns = inspector.get_columns(table_name)

    return [
        column["name"]
        for column in columns
    ]