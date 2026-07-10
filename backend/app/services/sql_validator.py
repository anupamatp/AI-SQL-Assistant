def validate_sql(sql: str):
    """
    Validate AI-generated SQL.
    Allow only SELECT queries.
    """

    sql = sql.strip().upper()

    # Must start with SELECT
    if not sql.startswith("SELECT"):
        return False, "Only SELECT queries are allowed."

    # Dangerous SQL keywords
    blocked_keywords = [
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "CREATE",
        "REPLACE",
        "GRANT",
        "REVOKE",
    ]

    for keyword in blocked_keywords:
        if keyword in sql:
            return False, f"{keyword} statements are not allowed."

    return True, None

