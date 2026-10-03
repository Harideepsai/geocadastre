"""
Python Cadastre Geometry & 3D ULPIN Engine
Smart India Hackathon 2026 (SIH26011) Prototype

Provides spatial geometry utilities, volumetric parcel calculation,
and 3D ULPIN (Unique Land Parcel Identification Number) validation.
"""

import math
import hashlib
from typing import Dict, Any, List, Tuple


def calculate_polygon_centroid(coords: List[Tuple[float, float]]) -> Tuple[float, float]:
    """Calculate the 2D centroid of a polygon coordinate sequence."""
    if not coords:
        return (0.0, 0.0)
    
    n = len(coords)
    sum_x = sum(pt[0] for pt in coords)
    sum_y = sum(pt[1] for pt in coords)
    return (sum_x / n, sum_y / n)


def compute_volume(footprint_area: float, z_min: float, z_max: float) -> float:
    """Calculate the volume of a 3D cadastral parcel in cubic meters."""
    height = max(0.0, z_max - z_min)
    return footprint_area * height


def generate_3d_ulpin(
    state_code: str,
    district_code: str,
    sub_district_code: str,
    village_code: str,
    survey_number: str,
    floor_level: int,
    unit_number: str,
    z_min: float,
    z_max: float
) -> str:
    """
    Generate standard 3D ULPIN string with vertical stratum token.
    Format: IND-{STATE}-{DIST}-{SUBD}-{VILL}-{SURVEY}-F{FLOOR}-U{UNIT}-Z{ZMIN}_{ZMAX}
    """
    clean_survey = survey_number.replace('/', '-').replace(' ', '_').upper()
    clean_unit = unit_number.replace(' ', '_').upper()
    z_str = f"Z{int(z_min)}_{int(z_max)}"
    
    base_ulpin = (
        f"IND-{state_code.upper()}-{district_code.upper()}-"
        f"{sub_district_code.upper()}-{village_code.upper()}-"
        f"{clean_survey}-F{floor_level:02d}-U{clean_unit}-{z_str}"
    )
    return base_ulpin


if __name__ == "__main__":
    demo_ulpin = generate_3d_ulpin(
        state_code="TS",
        district_code="HYD",
        sub_district_code="SER",
        village_code="MAD",
        survey_number="3127",
        floor_level=4,
        unit_number="402",
        z_min=12.0,
        z_max=15.0
    )
    print(f"Generated 3D ULPIN: {demo_ulpin}")
