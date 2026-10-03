"""
LiDAR & Photogrammetry Point Cloud Utilities
SIH26011 3D Geocadastre
"""

import json
from typing import List, Dict, Any


def parse_xyz_point_cloud(lines: List[str]) -> Dict[str, Any]:
    """Parse raw ASCII / XYZ format point clouds into bounding box and point counts."""
    points = []
    min_x = min_y = min_z = float('inf')
    max_x = max_y = max_z = float('-inf')

    for line in lines:
        parts = line.strip().split()
        if len(parts) >= 3:
            try:
                x, y, z = float(parts[0]), float(parts[1]), float(parts[2])
                points.append((x, y, z))
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)
                min_z = min(min_z, z)
                max_z = max(max_z, z)
            except ValueError:
                continue

    return {
        "point_count": len(points),
        "bounds": {
            "min": [min_x, min_y, min_z] if points else [0, 0, 0],
            "max": [max_x, max_y, max_z] if points else [0, 0, 0],
        },
        "elevation_delta": (max_z - min_z) if points else 0.0,
    }
