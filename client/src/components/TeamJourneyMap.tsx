import { FC } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

const TeamJourneyMap: FC<TeamJourneyMapProps> = ({ totalDistance, currentDistance }) => {
    const progress = totalDistance > 0 ? Math.min(1, Math.max(0, currentDistance / totalDistance)) : 0;
    const currentPos = interpolateCoords(OIAPOQUE, CHUI, progress);

    return (
        <div className="mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 p-2 relative" style={{ height: 400 }}>
            <MapContainer
                {...({
                    center: OIAPOQUE,
                    zoom: 6,
                    style: { height: 380, width: '100%', borderRadius: '0.75rem' },
                    scrollWheelZoom: false,
                    dragging: true,
                } as any)}
            >
                <Polyline positions={[OIAPOQUE, CHUI]} pathOptions={{ color: 'blue' }} />
                <Polyline positions={[OIAPOQUE, currentPos]} pathOptions={{ color: 'green', weight: 8 }} />
                <TileLayer
                    {...({
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        attribution: "&copy; OpenStreetMap contributors",
                    } as any)}
                />
                <Marker position={OIAPOQUE}>
                    <Popup>Oiapoque (Start)</Popup>
                </Marker>
                <Marker position={CHUI}>
                    <Popup>Chuí (End)</Popup>
                </Marker>
                <Marker position={currentPos}>
                    <Popup>{currentDistance.toLocaleString(undefined, { maximumFractionDigits: 1 })} km walked</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default TeamJourneyMap; 