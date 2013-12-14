function deg2rad(angle) {
    return angle * .017453292519943295; // (angle / 180) * Math.PI;
};

function rad2deg (angle) {
    return angle * 57.29577951308232; // angle / Math.PI * 180
};

getBoundingBox = function(lat_degrees,lon_degrees,distance_in_km) {

    var array = [];
    var radius = 6378; // of earth in km

    // bearings - FIX   
    var due_north = deg2rad(0);
    var due_south = deg2rad(180);
    var due_east = deg2rad(90);
    var due_west = deg2rad(270);

    // convert latitude and longitude into radians 
    var lat_r = deg2rad(lat_degrees);
    var lon_r = deg2rad(lon_degrees);

    // find the northmost, southmost, eastmost and westmost corners distance_in_km away
    // original formula from
    // http://www.movable-type.co.uk/scripts/latlong.html

    northmost  = Math.asin(Math.sin(lat_r)*Math.cos(distance_in_km/radius)+Math.cos(lat_r)*Math.sin(distance_in_km/radius)*Math.cos(due_north));
    southmost  = Math.asin(Math.sin(lat_r)*Math.cos(distance_in_km/radius)+Math.cos(lat_r)*Math.sin(distance_in_km/radius)*Math.cos(due_south));

    eastmost = lon_r + Math.atan2(Math.sin(due_east)*Math.sin(distance_in_km/radius)*Math.cos(lat_r),Math.cos(distance_in_km/radius)-Math.sin(lat_r)*Math.sin(lat_r));
    westmost = lon_r + Math.atan2(Math.sin(due_west)*Math.sin(distance_in_km/radius)*Math.cos(lat_r),Math.cos(distance_in_km/radius)-Math.sin(lat_r)*Math.sin(lat_r));


    northmost = rad2deg(northmost);
    southmost = rad2deg(southmost);
    eastmost = rad2deg(eastmost);
    westmost = rad2deg(westmost);

    // sort the lat and long so that we can use them for a between query        
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

// Testje met coordinaten (is dus geen rijksdriehoekcoordinaten)
// getBoundingBox(51.697928000000000000, 5.317005999999992000, 3.6);
