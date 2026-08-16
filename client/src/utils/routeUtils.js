function calculateDistance(propertyA, propertyB) {
  const earthRadius = 6371;

  const latitude1 = (propertyA.latitude * Math.PI) / 180;
  const latitude2 = (propertyB.latitude * Math.PI) / 180;

  const latitudeDifference =
    ((propertyB.latitude - propertyA.latitude) * Math.PI) / 180;

  const longitudeDifference =
    ((propertyB.longitude - propertyA.longitude) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export function optimizeRoute(properties) {
  if (properties.length <= 2) {
    return properties;
  }

  const remainingProperties = [...properties];

  const optimizedRoute = [remainingProperties.shift()];

  while (remainingProperties.length > 0) {
    const currentProperty = optimizedRoute[optimizedRoute.length - 1];

    let closestIndex = 0;
    let closestDistance = Infinity;

    remainingProperties.forEach((property, index) => {
      const distance = calculateDistance(currentProperty, property);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const [closestProperty] = remainingProperties.splice(closestIndex, 1);

    optimizedRoute.push(closestProperty);
  }

  return optimizedRoute;
}
