import pandas as pd

from sqlalchemy import (
    Integer,
    Float,
    String,
    Boolean,
    DateTime,
    MetaData,
    Table,
    Column,
    insert
)


def get_sqlalchemy_type(dtype):
    """
    Convert Pandas data type to SQLAlchemy type.
    """

    if pd.api.types.is_integer_dtype(dtype):
        return Integer

    elif pd.api.types.is_float_dtype(dtype):
        return Float

    elif pd.api.types.is_bool_dtype(dtype):
        return Boolean

    elif pd.api.types.is_datetime64_any_dtype(dtype):
        return DateTime

    else:
        return String


def create_dynamic_table(table_name, dataframe, engine):
    """
    Create a PostgreSQL table dynamically based on the uploaded dataset.
    """

    metadata = MetaData()

    columns = []

    for column_name, dtype in dataframe.dtypes.items():

        clean_column_name = (
            column_name.strip()
            .replace(" ", "_")
            .replace("-", "_")
            .lower()
        )

        sqlalchemy_type = get_sqlalchemy_type(dtype)

        columns.append(
            Column(clean_column_name, sqlalchemy_type)
        )

    table = Table(
        table_name,
        metadata,
        *columns
    )

    metadata.create_all(engine)

    return table


def insert_dataframe(table, dataframe, engine):
    """
    Insert a Pandas DataFrame into the dynamically created table.
    """

    records = dataframe.to_dict(orient="records")

    with engine.begin() as connection:
        connection.execute(
            insert(table),
            records
        )