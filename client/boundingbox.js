function deg2rad(angle) {
    return angle * .017453292519943295; // (angle / 180) * Math.PI;
};

function rad2deg (angle) {
    return angle * 57.29577951308232; // angle / Math.PI * 180
};

x2lat = function(xPosition,xWidth,latDegrees,lonDegrees,distanceKm) {
        var latMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[0];
        var latMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[1];
        var x2latPosition = latMin+(xPosition*((latMax - latMin)/xWidth));
        return x2latPosition;
};

y2lon = function(yPosition,yHeight,latDegrees,lonDegrees,distanceKm) {
        var lonMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[2];
        var lonMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[3];
        var y2lonPosition = lonMin+(yPosition*((lonMax - lonMin)/yHeight));
        return y2lonPosition;
};

lat2x = function(latPosition,xWidth,latDegrees,lonDegrees,distanceKm) {
        var latMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[0];
        var latMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[1];
        var lat2xPosition = Math.round((latMax - latPosition)*(xWidth/(latMax-latMin)))
        return lat2xPosition;
};

lon2y = function(lonPosition,yHeight,latDegrees,lonDegrees,distanceKm) {
        var lonMin = getBoundingBox(latDegrees,lonDegrees,distanceKm)[2];
        var lonMax = getBoundingBox(latDegrees,lonDegrees,distanceKm)[3];
        var lon2yPosition = Math.round(yHeight-((lonMax - lonPosition)*(yHeight/(lonMax-lonMin))))
        return lon2yPosition;
};

getBoundingBox = function(latDegrees,lonDegrees,distanceKm) {

    var radius = 6378;

    var dueNorth = deg2rad(0);
    var dueSouth = deg2rad(180);
    var dueEast = deg2rad(90);
    var dueWest = deg2rad(270);

    var latRadius = deg2rad(latDegrees);
    var lonRadius = deg2rad(lonDegrees);

    northmost  = Math.asin(Math.sin(latRadius)*Math.cos(distanceKm/radius)+Math.cos(latRadius)*Math.sin(distanceKm/radius)*Math.cos(dueNorth));
    southmost  = Math.asin(Math.sin(latRadius)*Math.cos(distanceKm/radius)+Math.cos(latRadius)*Math.sin(distanceKm/radius)*Math.cos(dueSouth));

    eastmost = lonRadius + Math.atan2(Math.sin(dueEast)*Math.sin(distanceKm/radius)*Math.cos(latRadius),Math.cos(distanceKm/radius)-Math.sin(latRadius)*Math.sin(latRadius));
    westmost = lonRadius + Math.atan2(Math.sin(dueWest)*Math.sin(distanceKm/radius)*Math.cos(latRadius),Math.cos(distanceKm/radius)-Math.sin(latRadius)*Math.sin(latRadius));


    northmost = rad2deg(northmost);
    southmost = rad2deg(southmost);
    eastmost = rad2deg(eastmost);
    westmost = rad2deg(westmost);

    if (northmost > southmost) { 
        lat1 = southmost;
        lat2 = northmost;
    } else {
        lat1 = northmost;
        lat2 = southmost;
    };


    if (eastmost > westmost) { 
        lon1 = westmost;
        lon2 = eastmost;
    } else {
        lon1 = eastmost;
        lon2 = westmost;
    };

    return [lat1,lat2,lon1,lon2]
};
