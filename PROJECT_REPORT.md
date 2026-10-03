# 3D Geocadastre: Volumetric Property & Land Parcel Management System
## Comprehensive Technical Project Report

**Project Code:** SIH26011  
**Project Domain:** Ministry of Housing & Urban Affairs / Department of Land Resources (DoLR)  
**Standard Compliance:** 3D ULPIN (Unique Land Parcel Identification Number) & ISO 19152 (Land Administration Domain Model - LADM)  
**Target Environment:** Full-Stack Cloud & WebGL-Enabled Modern Web Application  

---

## 1. Executive Summary

Traditional cadastral systems represent land parcels as flat, two-dimensional (2D) surface polygons. In modern vertical urban environments (skyscrapers, multi-level residential apartments, underground parking complexes, metro tunnels, and sub-surface utility corridors), 2D representations fail to convey spatial rights, restrictions, and responsibilities (RRRs). 

The **3D Geocadastre Platform** is a spatial web application designed to model, register, visualize, and audit land parcels in true three dimensions (3D). It combines:
1. **Interactive 3D WebGL Digital Twins** of multi-level buildings and underground utilities.
2. **Automated 3D ULPIN Engine** compliant with national cadastral standards, embedding vertical strata tokens (`SURF`, `AIR`, `SUB`) and z-elevation bounding datums.
3. **Sub-Surface Clash Detection** auditing spatial intersections between building foundations/basements and municipal utility corridors (water mains, gas pipelines, metro tunnels).
4. **Algorithmic 2D Blueprint-to-3D Extrusion** converting architectural raster/vector floor plans into volumetric geometries with courtyard voids and wall boundaries.
5. **Surveyor Drone & LiDAR Ingestion** parsing raw photogrammetry and point clouds into volumetric models and digital surface models (DSM).
6. **Government Workflow & Role-Based Access Control (RBAC)** across 5 stakeholder tiers: Citizen, Surveyor, Town Planner, Sub-Registrar (SRO), and Administrator.

---

## 2. Complete Technology Stack

### 2.1 Frontend Technologies
| Component | Technology | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **UI Library** | React | `^19.0.1` | Declarative component hierarchy and reactive application state |
| **Language** | TypeScript | `~5.8.2` | Strict static typing, spatial interfaces, and model contracts |
| **Bundler & Dev Server**| Vite | `^6.2.3` | Ultra-fast Hot Module Replacement (HMR) and optimized Rollup asset bundling |
| **CSS Framework** | Tailwind CSS | `^4.1.14` | Modern utility-first styling with `@tailwindcss/vite` integration |
| **Animations** | Motion (Framer Motion) | `^12.23.24` | Smooth modal transitions, drawer animations, and tactical UI indicators |
| **Iconography** | Lucide React | `^0.546.0` | High-density vector iconography for institutional UI |
| **CSV Parsing** | PapaParse | `^5.7.0` | Client-side CSV surveyor coordinate import and coordinate sequence ingestion |

### 2.2 3D Graphics & Spatial Visualization
| Component | Technology | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **3D Engine** | Three.js | `^0.185.1` | WebGL scene graph, custom shaders, raycasting, camera management, and geometry generation |
| **3D File Loaders** | Three.js GLTFLoader / OBJLoader | Built-in | Loading and rendering binary `.glb` and `.gltf` 3D cadastral models |
| **Custom 3D Generator** | Custom GLB Binary Builder | In-house | Client/server procedural binary glTF buffer generation with embedded PBR materials |
| **2D GIS Map Engine** | Leaflet | `^1.9.4` | Interactive 2D map visualization, OpenStreetMap tile layers, cadastral parcel overlays |
| **Point Cloud Visualizer**| WebGL Canvas Engine | In-house | Hardware-accelerated point cloud rendering for LiDAR and drone photogrammetry |

### 2.3 Backend & Application Server
| Component | Technology | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | `>=18.0.0` | Asynchronous JavaScript runtime environment |
| **Web Framework** | Express | `^4.21.2` | RESTful API server, routing, file streaming, and static hosting |
| **TypeScript Runner** | TSX | `^4.21.0` | Direct execution of TypeScript backend scripts without manual build steps |
| **Backend Bundler** | esbuild | `^0.25.0` | Compiling backend source into a standalone production CommonJS executable (`dist/server.cjs`) |
| **Process Management** | Built-in Signal Handlers | Native | Graceful shutdown (`SIGTERM`, `SIGINT`) and HTTP connection cleanup |
| **Availability Service**| Keep-Alive Worker | In-house | Self-pinging interval mechanism preventing cold starts on cloud free tiers |

### 2.4 Database, Storage & Spatial Persistence
| Component | Technology | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **Relational Database**| PostgreSQL | `15+` | Enterprise relational database storage for cadastre records and ownership ledgers |
| **Spatial Extension** | PostGIS | `3.3+` | 3D spatial indexing (`GIST`), `ST_MakeSolid`, 3D volumetric polygon queries, EPSG:4326/3857 |
| **BaaS & Client** | Supabase JS Client | `^2.115.0` | Real-time database client, authentication, and cloud storage connectivity |
| **Security Layer** | PostgreSQL RLS (Row-Level Security) | Native SQL | Role-Based Access Control enforcing read/write privileges per user tier |
| **Local Active Store** | JSON Relational Store | File-based | High-performance atomic JSON store (`cadastre_database.json`) with auto-persistence |
| **3D Asset Storage** | Binary File System Store | `database/3d_files/` | File-system backed index of GLB, OBJ, and metadata JSON files organized by survey number |

### 2.5 Artificial Intelligence & Computer Vision
| Component | Technology | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **Multimodal LLM SDK** | `@google/genai` (Google Gemini) | `^2.4.0` | Gemini 2.5 Flash multimodal vision analysis for architectural blueprint extraction |
| **Blueprint Extractor** | Algorithmic Image Processor | TypeScript | Edge detection, contour tracing, courtyard void extraction, and 2D wall polygon generation |
| **Elevation Segmenter** | Geometric Heuristic Engine | TypeScript / Python | Automated vertical zoning and strata level allocation from building heights |

### 2.6 Python Spatial Microservices
| Library | Minimum Version | Purpose / Description |
| :--- | :--- | :--- |
| **Shapely** | `>=2.0.0` | Computational planar geometry, polygon intersection, union, and buffer operations |
| **GeoPandas** | `>=0.13.0` | Geospatial dataframe manipulation, spatial indexing, coordinate projection conversions |
| **Trimesh** | `>=4.0.0` | 3D triangular mesh manipulation, watertight verification, volume calculations, and export |
| **Laspy** | `>=2.5.0` | Reading and writing ASPRS LAS/LAZ LiDAR point cloud binary records |
| **NumPy & SciPy** | `>=1.24.0` | High-performance matrix manipulation, Delaunay triangulation, and spatial KD-trees |

### 2.7 DevOps & Deployment Infrastructure
| Component | Platform / Tool | Description |
| :--- | :--- | :--- |
| **Hosting Platform** | Render / Cloud VM | Containerized or native Node.js web service running continuous builds |
| **Deployment Blueprint**| `render.yaml` | Infrastructure-as-code declaration specifying environment variables, build, and start commands |
| **Source Control** | Git & GitHub | Distributed version control with organized feature branching and commit tracking |

---

## 3. Modular System Architecture

The codebase follows a decoupled 3-tier architecture with dedicated separation of concerns:

```
geocadastre/
├── frontend/                     # React 19 Client Application
│   ├── app/                      # Application entrypoints & global styles
│   │   ├── App.tsx               # Root application layout & state coordinator
│   │   ├── GeoCadastreApp.tsx    # Primary feature controller & tab navigation
│   │   ├── index.css             # Tailwind 4 design system & theme tokens
│   │   └── main.tsx              # React DOM mounting & root initialization
│   ├── components/               # High-fidelity UI modules & 3D canvases
│   │   ├── BuildingDetailsView.tsx       # Building metadata, floor breakdown & 3D model link
│   │   ├── CombinedDemoView.tsx          # Dual-mode 2D GIS Map & 3D Split Screen viewer
│   │   ├── DashboardView.tsx             # Institutional stats, KPIs, and status overview
│   │   ├── DroneFlightPreviewCanvas.tsx  # Drone flight path trajectory visualizer
│   │   ├── EditFlatModal.tsx             # Modal for editing flat/unit spatial parameters
│   │   ├── LeafletMap.tsx                # Interactive 2D geospatial parcel boundaries
│   │   ├── Model3DPreview.tsx            # Standalone GLTF/GLB preview renderer
│   │   ├── ModelIngestionModal.tsx       # 3D upload, blueprint extraction & mesh wizard
│   │   ├── ParcelMapPicker.tsx           # Interactive 2D coordinate & parcel boundary selector
│   │   ├── PlannerQueueView.tsx          # Town Planning approval & clash detection portal
│   │   ├── PointCloudPreviewCanvas.tsx   # Direct WebGL LiDAR point cloud renderer
│   │   ├── PropertyDetailsView.tsx       # Comprehensive property title & stratum viewer
│   │   ├── PropertyRecordsView.tsx       # Searchable cadastre registry & filter engine
│   │   ├── SecurityGateOverlay.tsx       # Institutional authentication gate
│   │   ├── SROQueueView.tsx              # Sub-Registrar deed registration & stamp verification
│   │   ├── SurveyorSubmissionsView.tsx   # Field surveyor upload & coordinate audit queue
│   │   ├── TacticalBuildingOverlay.tsx   # Real-time telemetry, coordinates & strata heights
│   │   ├── ThreeCanvas.tsx               # Primary 3D WebGL Canvas with strata controls
│   │   └── ValidationModal.tsx           # Mathematical integrity & watertightness auditor
│   ├── lib/                      # Shared business logic, types & utilities
│   │   ├── db/relationalStore.ts # Client mock & relational state helpers
│   │   ├── services/             # API client, Auth, Clash Detection, ULPIN engine
│   │   ├── utils/                # Blueprint processing, photogrammetry, GLB builders
│   │   └── types.ts              # Core TypeScript interface definitions
│   └── public/                   # Static assets, institutional crests, and favicon
│
├── backend/                      # Express API Server & Computational Engines
│   ├── src/
│   │   ├── db/relationalStore.ts # Seed databases, atomic state mutations, and mock models
│   │   ├── services/
│   │   │   ├── clashDetector.ts  # 3D AABB & cylindrical sub-surface clash detection algorithms
│   │   │   └── ulpinEngine.ts    # 3D ULPIN generation, vertical hashing, and parsing
│   │   ├── utils/
│   │   │   ├── glbBuilder.ts     # Procedural binary GLB byte buffer synthesizer
│   │   │   └── keepAlive.ts      # Cloud host ping service
│   │   ├── server.ts             # Express REST endpoints, Gemini AI router & Vite middleware
│   │   └── types.ts              # Server-side domain entities & data contracts
│   ├── python/                   # Python Spatial Geometry Microservices
│   │   ├── cadastre_processor.py # Centroid calculations, 3D volume, 3D ULPIN generation
│   │   ├── gis_converter.py      # GeoJSON feature bounds & ring coordinate extractor
│   │   ├── point_cloud_tools.py  # ASCII XYZ/LiDAR parser & bounding box calculator
│   │   ├── requirements.txt      # Spatial dependency specifications
│   │   └── README.md             # Python module documentation
│   └── temp/                     # Temporary processing workspace (git-ignored)
│
├── database/                     # Spatial Data & Schemas
│   ├── cadastre_database.json    # Active persistent database store
│   ├── supabaseSchema.sql        # PostgreSQL + PostGIS 3D spatial schema DDL
│   ├── supabaseRBAC.sql          # Row-Level Security policies for all 5 roles
│   ├── supabaseSchema.sql.ts     # TypeScript DDL export
│   ├── README.md                 # Database layer overview
│   └── 3d_files/                 # Physical 3D models (.glb, .obj, .las) grouped by survey
│
├── index.html                    # Single Page Application HTML shell
├── package.json                  # Scripts, dependencies, and project metadata
├── tsconfig.json                 # TypeScript compiler configuration with path aliases
├── vite.config.ts                # Vite configuration with path aliases & Tailwind 4
├── render.yaml                   # Cloud infrastructure blueprint
└── server.ts                     # Root entrypoint redirecting to backend/src/server.ts
```

---

## 4. Key Functional Features & Innovation

### 4.1 True 3D Volumetric Parceling & 3D ULPIN Standard
Traditional Indian land parcels use a 14-digit 2D ULPIN based on latitude/longitude centroids. The 3D Geocadastre platform extends this into a vertical strata standard:
$$\text{3D ULPIN} = \text{IND-}\{\text{STATE}\}\text{-}\{\text{DIST}\}\text{-}\{\text{SUBD}\}\text{-}\{\text{VILL}\}\text{-}\{\text{SURVEY}\}\text{-F}\{\text{FLOOR}\}\text{-U}\{\text{UNIT}\}\text{-Z}\{\text{Z}_{\min}\}\text{\_}\{\text{Z}_{\max}\}$$

* **Vertical Strata Classification**:
  * `SUB` (Subterranean): Basements, underground parking, foundation footings below 0.0m datum.
  * `SURF` (Surface): Ground level, stilt parking, entry lobbies ($0.0\text{m} \le z < 3.0\text{m}$).
  * `AIR` (Air Rights / Superstructure): Elevated residential/commercial apartments, skywalks, rooftop amenities ($z \ge 3.0\text{m}$).
* **Volumetric Metrics**: Automated computation of gross footprint area ($\text{m}^2$), ceiling clearance ($h = z_{\max} - z_{\min}$), and parcel volume ($\text{m}^3$).

### 4.2 High-Performance Interactive 3D WebGL Viewer
Implemented using Three.js and custom shaders within `ThreeCanvas.tsx`:
* **Camera Modes**: Orbit perspective view and orthographic elevation/floor-plan views.
* **Strata Isolation**: Interactive toggling to view all floors, single selected floor levels, or sub-surface foundation layers.
* **Interactive Raycasting**: Click-to-inspect on 3D meshes displays real-time ownership titles, property market values, deed numbers, and encumbrances.
* **Vertical Exploded View**: Sliders dynamically separate floor slabs along the Y-axis to reveal interior unit subdivisions.
* **Volumetric Sun & Shadow Analysis**: Real-time directional lighting calibrated to geographic solar angles to assess daylight access and shadow encroachment.

### 4.3 Sub-Surface Infrastructure & 3D Clash Detection
Municipal underground infrastructure is plotted alongside private parcel subterranean structures:
* **Infrastructure Layer**: Drinking water pipelines, high-pressure gas mains, storm sewer lines, telecommunication conduits, and underground metro transit tunnels.
* **3D Collision Algorithms**:
  * Computes Axis-Aligned Bounding Box (AABB) intersections and 3D Euclidean cylindrical buffer envelopes between deep pile foundations / basements and municipal easements.
  * Automatically issues **CRITICAL ALERTS**, **SAFETY WARNINGS**, or **STATUTORY CLEARANCE CONFIRMATIONS** before town planning approval.

### 4.4 Algorithmic 2D Blueprint-to-3D Extrusion Engine
Located in `frontend/lib/utils/blueprintProcessor.ts` and `backend/src/server.ts`:
* Ingests 2D architectural blueprint floor plans in image formats (PNG, JPG) or vector coordinates.
* Uses computer vision algorithms to trace outer building perimeters, identify interior structural partition walls, isolate circulation corridors, and carve out inner courtyard voids.
* Procedurally extrudes 2D coordinate loops into clean 3D solid geometries with floor thickness and ceiling heights.

### 4.5 Drone Photogrammetry & LiDAR Point Cloud Processing
Located in `frontend/lib/utils/pointCloudParser.ts` and `backend/python/point_cloud_tools.py`:
* Ingests ASPRS standard LiDAR point clouds (`.las`, `.laz`, `.xyz`, `.pts`).
* Parses millions of XYZ coordinates, calculates spatial bounding boxes, elevation deltas, and point density.
* Visualizes interactive drone flight paths displaying camera trigger points, gimbal pitches, altitude profiles, and ground sampling distances (GSD).

### 4.6 End-to-End Government Role-Based Workflow (RBAC)
The system models statutory workflows across five designated roles:
1. **Citizen Portal**: Search properties by survey number or 3D ULPIN, view 3D property boundaries, verify ownership authenticity, and inspect encumbrance certificates.
2. **Licensed Surveyor Portal**: Submit GPS boundaries, upload raw LiDAR/drone point clouds, ingest 3D CAD/BIM models, and verify coordinate conformity.
3. **Town Planner (Urban Local Body / ULB) Portal**: Review submitted 3D building envelopes, audit floor area ratios (FAR/FSI), verify building height statutory compliance, and run sub-surface clash detection against municipal utilities.
4. **Sub-Registrar Office (SRO) Portal**: Verify biometric ownership identity, compute stamp duty based on 3D volumetric unit area, audit title history, and register digital deeds.
5. **System Administrator**: Manage user privileges, monitor server health, inspect relational database integrity, and download audit logs.

---

## 5. Database Architecture & PostGIS Spatial Modeling

### 5.1 Relational Entity Schema
The database models 8 interconnected core entities:

```
[ Location (Village/Mandal/District) ]
                 │
                 ▼
          [ Building ] ◄────────────── [ Building 3D File ]
                 │
                 ▼
              [ Floor ]
                 │
                 ▼
          [ Property Unit ]
                 │
                 ├── [ Vertical Geometry (3D Bounds) ]
                 └── [ Ownership ] ────────► [ Owner (Citizen) ]
```

* **`locations`**: State, District, Mandal, Village codes and base geodetic datum.
* **`buildings`**: Survey numbers, base latitude/longitude, total height, ground footprint, construction status, and approval stage.
* **`floors`**: Floor index (e.g. -1 for B1, 0 for Ground, 1..N for upper floors), vertical datum offset, ceiling height, and strata classification (`SUB`, `SURF`, `AIR`).
* **`property_units`**: Flat number, carpet area, built-up area, usage (residential/commercial), standard 3D ULPIN, and tax assessment number.
* **`vertical_geometries`**: $Z_{\min}$, $Z_{\max}$, height delta, 3D volume ($\text{m}^3$), 3D bounding box coordinates, and polygon ring vertices.
* **`owners`**: Aadhaar hash, full name, contact, identity verification status.
* **`ownerships`**: Title deed registration number, purchase date, registration value (INR), share percentage, and encumbrance/mortgage status.
* **`underground_assets`**: Municipal utility type, depth start/end, diameter, safety buffer zone ($m$), route 3D vector coordinates.

### 5.2 PostGIS 3D Spatial Script (`database/supabaseSchema.sql`)
* Implements spatial extensions:
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  CREATE EXTENSION IF NOT EXISTS postgis_topology;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
* Generates 3D volumetric parcel solids with `ST_MakeSolid(ST_Extrude(...))` using `EPSG:4326` (WGS 84) and projected `EPSG:3857`.
* Establishes high-performance 3D spatial indexing:
  ```sql
  CREATE INDEX idx_cadastre_geom_3d ON vertical_geometries USING GIST (geometry_3d);
  ```

### 5.3 Row-Level Security (`database/supabaseRBAC.sql`)
* Enforces least-privilege security policies where citizens have read-only access to approved records, surveyors can insert draft applications, town planners can mutate approval statuses, and SRO officers can seal title deeds.

---

## 6. REST API Endpoint Specifications

All server endpoints are hosted via Express on `http://0.0.0.0:10000` (or `PORT` environment variable).

### 6.1 Cadastre & Property Records
* `GET /api/properties`: Retrieves all enriched property units with owner info, floor data, and 3D bounds.
* `GET /api/properties/:id`: Retrieves single property detail by UUID or 3D ULPIN.
* `POST /api/properties`: Registers new property unit with automatic 3D ULPIN generation.
* `PUT /api/properties/:id`: Updates property parameters, unit boundaries, or ownership titles.
* `GET /api/buildings`: Retrieves all building structures with spatial coordinates and floor counts.
* `GET /api/buildings/:id`: Retrieves building details along with linked 3D models and floor breakdown.

### 6.2 3D Model & File Operations
* `GET /api/buildings/:buildingId/3d-model`: Streams binary `.glb` 3D cadastral model for WebGL rendering.
* `POST /api/buildings/:buildingId/upload-3d`: Ingests surveyor 3D models (`.glb`, `.obj`, point clouds) with SHA-256 checksum generation.
* `GET /api/3d-files`: Lists all stored 3D cadastral models and metadata.
* `GET /api/3d-files/:id/download`: Direct binary stream download of stored 3D cadastral models.

### 6.3 Sub-Surface Utilities & Clash Detection
* `GET /api/underground-assets`: Retrieves all registered municipal pipelines, power corridors, and metro routes.
* `POST /api/underground-assets`: Registers a new municipal underground asset with 3D route points and buffer radius.
* `POST /api/clash-detection/:buildingId`: Executes full 3D spatial clash audit between building foundations and municipal assets; returns detailed collision report.

### 6.4 AI & Computational Geometry
* `POST /api/ai/extract-blueprint`: Multimodal Gemini 2.5 Flash analysis of 2D blueprints to extract coordinate loops and wall polygons.
* `POST /api/ai/segment-floors`: Computes mathematical strata elevation slicing, designating sub-surface, surface, and upper floors.

---

## 7. Deployment & Environment Configuration

### 7.1 Cloud Deployment Architecture (`render.yaml`)
* **Service Type**: Web Service (Node.js)
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm start` (executes `node dist/server.cjs`)
* **Static Assets**: Automatically served by Express from the production Vite build directory (`dist/`).
* **Dev Server**: Integrated Vite middleware mode (`tsx backend/src/server.ts`) for continuous local development.

### 7.2 Environment Variables
| Variable | Required | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | Runtime mode (`development` or `production`) |
| `PORT` | Optional | Server port (defaults to `10000` or `3000`) |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for AI blueprint parsing and deed verification |
| `VITE_SUPABASE_URL` | Optional | Supabase PostgreSQL project URL |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase public anonymous API key |
| `APP_URL` | Optional | Public application URL used by the keep-alive ping worker |

---

## 8. Verification & Build Integrity

The application has been verified for build correctness and type safety:
* **TypeScript Compilation**: Zero compilation errors across both `frontend` and `backend` modules.
* **Vite Bundle**: Minified, tree-shaken, and optimized production bundle:
  * `dist/index.html`: `1.62 kB`
  * `dist/assets/index-[hash].css`: `78.62 kB`
  * `dist/assets/index-[hash].js`: `1,886.13 kB`
* **esbuild Server Executable**: Standalone compiled bundle `dist/server.cjs` (`131.2 kB`) with full source mapping.

---

## 9. Conclusion

The **3D Geocadastre Platform** represents a comprehensive, production-ready solution to modern 3D land administration challenges. By bridging 2D GIS mapping, 3D WebGL computer graphics, computational geometry, municipal clash detection, and institutional government workflows, it establishes a verifiable foundation for next-generation urban land governance in India and globally.
