// Challenge 2 - More Data
// Step 1: Import Data from USGS GeoJson Feed (Eartquakes with 2.5+ Magnitude in Past Week)

var geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Step 2: Query geoURL to obatain data

d3.json(geoURL, function(data){
    // Print to console for debugging
    console.log(geoURL)
    // Send data to createFeatures function 
    createFeatures(data.features);
});

// Step 3: Create Map

function createFeatures(geoData) {
    var geoMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 15,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var darkMode = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var grayMode = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
      });

    // Plot points
    var plotArray = new Array();
    for (var i = 0; i < geoData.length; i++) {
        coordinates = [geoData[i].geometry.coordinates[1], geoData[i].geometry.coordinates[0]]
        properties = geoData[i].properties;

        // Conditional formatting based on earthquake magnitude 
        var plotColor = "#CC0000";
        if (properties.mag < 1) {
            plotColor = "#B3E6C9";
        }
        else if (properties.mag < 2) {
            plotColor = "#BFD9BF";
        }
        else if (properties.mag < 3) {
            plotColor = "#FFFF99";
        }
        else if (properties.mag < 4) {
            plotColor = "#F8C9A0";
        }
        else if (properties.mag < 5) {
            plotColor = "#FF9999";
        }

        // Format plot circle properties
        var plots = L.circle(coordinates, {
            fillOpacity: 0.75,
            color: plotColor,
            fillColor: plotColor,
            radius: (properties.mag * 15000)
        }).bindPopup("<h3>" + properties.place + "</h3> <hr> <h3>Magnitude: " + properties.mag.toFixed(2) + "</h3>");

        // Push formatting to plots
        plotArray.push(plots);
    }

    // Configure Layers
    var earthquakes = L.layerGroup(plotArray);

    var baseMaps = {
        "Outdoors Map": geoMap,
        "Satellite Map": darkMode,
        "Grayscale": grayMode
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
    
    // The map itself
    var Map = L.map("map", {
        center: [39.82, -90.57],
        zoom: 3.5,
        layers: [geoMap, earthquakes],
        legend: true
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(Map);

    // Step 5: Create & configure map legend

    var legend = L.control({position: 'bottomright'});

    function getColor(d) {
        return d > 5 ? '#CC0000' :
            d > 4 ? '#FF9999' :
            d > 3 ? '#F8C9A0' :
            d > 2 ? '#FFFF99' :
            d > 1 ? '#BFD9BF' : '#B3E6C9';
    }

    legend.onAdd = function (Map) {
        var div = L.DomUtil.create('div', 'info legend');
        bins = [0, 1, 2, 3, 4, 5],
        labels = [];
        

        for (var i = 0; i < bins.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getColor(bins[i] + 1) + '"></i>' + 
                bins[i] + (bins[i + 1] ? '&ndash;' + bins[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(Map)
};
