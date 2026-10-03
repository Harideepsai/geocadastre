# 3D Geocadastre Database Layer

This directory houses the persistent relational database, PostGIS spatial schemas, and 3D binary cadastral files.

## Files & Directories

- **`cadastre_database.json`**: Active JSON relational store containing buildings, floors, property units, ownership titles, and underground infrastructure assets.
- **`supabaseSchema.sql`**: Production PostgreSQL + PostGIS DDL script establishing 3D volumetric parcels, spatial indexing (`GIST`), and coordinate references (EPSG:4326 / EPSG:3857).
- **`supabaseRBAC.sql`**: Row-Level Security (RLS) policies defining granular access for:
  - `citizen`
  - `surveyor`
  - `town_planner`
  - `sro_officer`
  - `admin`
- **`supabaseSchema.sql.ts`**: TypeScript module exporting the PostGIS DDL for developer tooling.
- **`3d_files/`**: Local disk store for uploaded surveyor 3D volumetric models (GLB, OBJ, LAS point clouds) indexed by survey number.
