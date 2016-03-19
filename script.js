$(function() {

  var lightNoLabels = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });
  var year = "1910";
  var map = new L.Map('map', {
    center: new L.LatLng(41.819824,-72.581177),
    zoom: 10,
    scrollWheelZoom: false,
    layers: [lightNoLabels]
  });

  map.attributionControl
  .setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-tabs">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>; design by <a href="http://ctmirror.org">CT Mirror</a>');

 // Edit the getColor property to match data column header in your GeoJson file
 function style(feature) {
   return {
     fillColor: getColor(feature.properties["index" + year]),
     weight: 1,
     opacity: 1,
     color: 'black',
     fillOpacity: 0.7,
   };
 }



//  var geojson;
//  makeMap(style);
//  function makeMap(theStyle) {
//   geojson = L.geoJson(cityData, {
//     style: theStyle,
//     onEachFeature: onEachFeature
//   }).addTo(map);
// }

// Edit to upload GeoJSON data file from your local directory; removed var = geoJsonLayer since this is declared above
$.getJSON("towns-index.geojson", function (data) {
  geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

// this highlights the layer on hover
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 4,
    color: 'black',
    fillOpacity: 0.7
  });

  info.update(layer.feature.properties);
}

// this resets the highlight after hover moves away; revised
function resetHighlight(e) {
  geoJsonLayer.setStyle(style);
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: highlightFeature
  });
}

// Edit ranges and colors to match your data; see http://colorbrewer.org
function getColor(d) {
  return d > 2 ? '#800026' :
         d > 1.5 ? '#BD0026' :
         d > 1  ? '#E31A1C' :
         d > 0.5  ? '#FC4E2A' :
         d > 0  ? '#FD8D3C' :
                    '#ffffff';
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  var winName =
  this._div.innerHTML = (props ?
    '<div class="townName">' + props.town.toProperCase() + '</div>' : '<div class="townName faded">Hover over towns</div>') + '<div class="labelItem"><div class="rightLabel">Home Value Index</div>' +(props ? '' + (checkNull(props["index" + year])) : '--') + '</div>';
};

info.addTo(map);

// Check this
$(".toolItem").click(function() {
  $(".toolItem").removeClass("selected");
  $(this).addClass("selected");
  year = $(this).html().split("-")[1];
  geoJsonLayer.setStyle(style);
});

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function checkNull(val) {
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

function checkThePct(a,b) {
  if (a != null && b != null) {
    return Math.round(a/b*1000)/10 + "%";
  } else {
    return "--";
  }
}

function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

});
