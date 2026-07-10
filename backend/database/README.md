# File: backend/database/README.md
# Module: Database
# Responsibility: Documents the local SQLite authentication database and seed script

This folder contains local authentication database utilities.

Runtime database file:

```text
auth.db
```

The `.db` file is generated locally and ignored by Git.

Seed an initial user from the backend folder:

```powershell
python database/seed_auth.py --email hr@example.com --full-name "HR User"
```

Or pass the password directly for local-only development:

```powershell
python database/seed_auth.py --email hr@example.com --full-name "HR User" --password "password123"
```