function x2lat(xPosition,xWidth,latDegrees,lonDegrees,distanceKm) {
	var latMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[0];
	var latMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[1];
	var x2latPosition = latMin+(xPosition*((latMax - latMin)/xWidth));
	return x2latPosition;
};

//x2lat(200, 500, 51.697928000000000000, 5.317005999999992000, 3.6);
