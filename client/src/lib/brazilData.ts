// Brazil coastline landmarks and distances
// This is a simplified representation of landmarks along Brazil's coast
// for the walking challenge

export interface BrazilLandmark {
  id: number;
  name: string;
  description: string;
  distanceFromStart: number; // km from starting point
  imageUrl: string;
}

// Starting from the northernmost point and moving south
export const brazilLandmarks: BrazilLandmark[] = [
  {
    id: 1,
    name: "Oiapoque",
    description: "Northernmost point of Brazil",
    distanceFromStart: 0,
    imageUrl: "https://images.unsplash.com/photo-1551312183-71b11ee884e3?q=80&w=1000"
  },
  {
    id: 2,
    name: "Belém",
    description: "Gateway to the Amazon",
    distanceFromStart: 350,
    imageUrl: "https://images.unsplash.com/photo-1599419238165-5d0a9ccb6206?q=80&w=1000"
  },
  {
    id: 3,
    name: "São Luís",
    description: "UNESCO World Heritage site",
    distanceFromStart: 650,
    imageUrl: "https://images.unsplash.com/photo-1619546952812-520e98064a52?q=80&w=1000"
  },
  {
    id: 4,
    name: "Fortaleza",
    description: "Popular beach destination",
    distanceFromStart: 950,
    imageUrl: "https://images.unsplash.com/photo-1667925225540-163d6cf5847d?q=80&w=1000"
  },
  {
    id: 5,
    name: "Natal",
    description: "City of dunes",
    distanceFromStart: 1200,
    imageUrl: "https://images.unsplash.com/photo-1599594430888-a89a123a225f?q=80&w=1000"
  },
  {
    id: 6,
    name: "Recife",
    description: "The Brazilian Venice",
    distanceFromStart: 1350,
    imageUrl: "https://images.unsplash.com/photo-1588262716317-c78ef3eb4614?q=80&w=1470"
  },
  {
    id: 7,
    name: "Salvador",
    description: "First colonial capital of Brazil",
    distanceFromStart: 1550,
    imageUrl: "https://images.unsplash.com/photo-1599933190257-ade62d308472?q=80&w=1470"
  },
  {
    id: 8,
    name: "Rio de Janeiro",
    description: "Home to Christ the Redeemer statue",
    distanceFromStart: 2050,
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000"
  },
  {
    id: 9,
    name: "São Paulo",
    description: "Brazil's largest city",
    distanceFromStart: 2200,
    imageUrl: "https://images.unsplash.com/photo-1543059080-f9b1272213a5?q=80&w=1000"
  },
  {
    id: 10,
    name: "Florianópolis",
    description: "Island city with beautiful beaches",
    distanceFromStart: 2500,
    imageUrl: "https://images.unsplash.com/photo-1617142108319-11f0edf9160e?q=80&w=1000"
  },
  {
    id: 11,
    name: "Porto Alegre",
    description: "Southern cultural hub",
    distanceFromStart: 2750,
    imageUrl: "https://images.unsplash.com/photo-1591203301323-8aea4e626b9d?q=80&w=1000"
  },
  {
    id: 12,
    name: "Chuí",
    description: "Southernmost point of Brazil",
    distanceFromStart: 2900,
    imageUrl: "https://images.unsplash.com/photo-1600194292090-9a89ef2a9aaf?q=80&w=1000"
  }
];

// Total distance of the challenge in kilometers
export const totalDistance = 2900;

// Convert steps to distance
export function stepsToDistance(steps: number): number {
  // Assuming 2,000 steps per mile (or 1,242 steps per km)
  const stepsPerKm = 1242;
  return steps / stepsPerKm;
}

// Get current landmark based on distance traveled
export function getCurrentLandmark(distanceTraveled: number): BrazilLandmark | undefined {
  // Find the last landmark that was passed
  const passedLandmarks = brazilLandmarks.filter(
    landmark => landmark.distanceFromStart <= distanceTraveled
  );
  
  if (passedLandmarks.length === 0) {
    return undefined;
  }
  
  return passedLandmarks[passedLandmarks.length - 1];
}

// Get upcoming landmarks
export function getUpcomingLandmarks(distanceTraveled: number, count: number = 3): BrazilLandmark[] {
  // Find landmarks that haven't been reached yet
  const upcomingLandmarks = brazilLandmarks
    .filter(landmark => landmark.distanceFromStart > distanceTraveled)
    .sort((a, b) => a.distanceFromStart - b.distanceFromStart)
    .slice(0, count);
  
  return upcomingLandmarks;
}
