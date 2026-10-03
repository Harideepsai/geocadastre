"""
GeoJSON & GIS Cadastral Data Converter
SIH26011 3D Geocadastre
"""

import json
from typing import Dict, Any, List


def geojson_to_cadastre_bounds(geojson_feature: Dict[str, Any]) -> Dict[str, Any]:
    """Extract spatial bounding box and polygon coordinates from GeoJSON feature."""
    geometry = geojson_feature.get("geometry", {})
    geom_type = geometry.get("type")
    coords = geometry.get("coordinates", [])

    if geom_type == "Polygon" and coords:
        ring = coords[0]
        lats = [pt[1] for pt in ring]
        lngs = [pt[0] for pt in ring]
        return {
            "min_lat": min(lats),
            "max_lat": max(lats),
            "min_lng": min(lngs),
            "max_lng": max(lngs),
            "vertex_count": len(ring),
        }
    return {}
