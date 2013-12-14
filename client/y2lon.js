function y2lon(yPosition,yHeight,latDegrees,lonDegrees,distanceKm) {
	var lonMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[2];
	var lonMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[3];
	var y2lonPosition = lonMin+(yPosition*((lonMax - lonMin)/yHeight));
	return y2lonPosition;
};

// Example
// Min: y2lon(0, 500, 51.697928000000000000, 5.317005999999992000, 3.6);
// Max: y2lon(500, 500, 51.697928000000000000, 5.317005999999992000, 3.6);
// Somewhere between: y2lon(200, 500, 51.697928000000000000, 5.317005999999992000, 3.6);
