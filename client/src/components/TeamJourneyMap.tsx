import { FC } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { brazilLandmarks } from '../lib/brazilData';

interface TeamJourneyMapProps {
    totalDistance: number; // in km
    currentDistance: number; // in km
}

const OIAPOQUE: [number, number] = [2.0500, -51.0667];
const CHUI: [number, number] = [-33.6861, -53.4597];

// Fix leaflet's default icon path so it works with Vite
(L.Icon.Default.prototype as any)._getIconUrl && delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function interpolateCoords(start: [number, number], end: [number, number], t: number): [number, number] {
    return [
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
    ];
}

function getTravelledPathCoords(distance: number) {
    // Find all landmarks passed
    const passed = brazilLandmarks.filter(l => l.distanceFromStart <= distance);
    // Find the next landmark
    const next = brazilLandmarks.find(l => l.distanceFromStart > distance);
    // If at or past last landmark, return all coords
    if (!next) return brazilLandmarks.map(l => l.coordinates);
    // If before first, just Oiapoque
    if (passed.length === 0) return [brazilLandmarks[0].coordinates];
    // Interpolate between last passed and next
    const last = passed[passed.length - 1];
    const segDist = next.distanceFromStart - last.distanceFromStart;
    const segProgress = (distance - last.distanceFromStart) / segDist;
    const interp = interpolateCoords(last.coordinates, next.coordinates, segProgress);
    return [...passed.map(l => l.coordinates), interp];
}

function getCurrentPosition(distance: number) {
    const passed = brazilLandmarks.filter(l => l.distanceFromStart <= distance);
    const next = brazilLandmarks.find(l => l.distanceFromStart > distance);
    if (!next) return brazilLandmarks[brazilLandmarks.length - 1].coordinates;
    if (passed.length === 0) return brazilLandmarks[0].coordinates;
    const last = passed[passed.length - 1];
    const segDist = next.distanceFromStart - last.distanceFromStart;
    const segProgress = (distance - last.distanceFromStart) / segDist;
    return interpolateCoords(last.coordinates, next.coordinates, segProgress);
}

const TeamJourneyMap: FC<TeamJourneyMapProps> = ({ totalDistance, currentDistance }) => {
    const progress = totalDistance > 0 ? Math.min(1, Math.max(0, currentDistance / totalDistance)) : 0;
    // Calculate travelled distance in km
    const travelledKm = totalDistance * progress;
    const travelledPath = getTravelledPathCoords(travelledKm);
    const currentPos = getCurrentPosition(travelledKm);

    return (
        <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-2 relative" style={{ height: 400 }}>
            <MapContainer
                {...({
                    center: brazilLandmarks[0].coordinates,
                    zoom: 6,
                    style: { height: 380, width: '100%', borderRadius: '0.75rem' },
                    scrollWheelZoom: false,
                    dragging: true,
                } as any)}
            >
                {/* Full route: all landmarks */}
                <Polyline positions={brazilLandmarks.map(l => l.coordinates)} pathOptions={{ color: 'blue' }} />
                {/* Distance travelled: passed landmarks + interpolated current position */}
                <Polyline positions={travelledPath} pathOptions={{ color: 'green', weight: 8 }} />
                <TileLayer
                    {...({
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        attribution: "&copy; OpenStreetMap contributors",
                    } as any)}
                />
                {/* Landmark markers */}
                {brazilLandmarks.map(landmark => (
                    <Marker key={landmark.id} position={landmark.coordinates}>
                        <Popup>
                            <strong>{landmark.name}</strong><br />
                            {landmark.description}
                        </Popup>
                    </Marker>
                ))}
                {/* Current position marker */}
                <Marker position={currentPos}>
                    <Popup>{currentDistance.toLocaleString(undefined, { maximumFractionDigits: 1 })} km walked</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default TeamJourneyMap; 