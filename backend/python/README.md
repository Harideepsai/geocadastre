# Python Cadastre Services & GIS Tools

This directory contains Python processing scripts and microservices for the 3D Geocadastre platform.

## Modules

- **`cadastre_processor.py`**: Calculates 3D volumetric footprints, centroid coordinates, and generates standardized 3D ULPIN tokens.
- **`point_cloud_tools.py`**: Parses raw LiDAR/Photogrammetric ASCII/XYZ point clouds for DSM extraction.
- **`gis_converter.py`**: Converts standard GeoJSON boundaries into volumetric 3D extruded cadastral parcels.
- **`requirements.txt`**: Python dependencies for spatial libraries (Shapely, GeoPandas, Trimesh, Laspy).
