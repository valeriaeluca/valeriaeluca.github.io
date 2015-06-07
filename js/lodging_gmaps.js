var stop = false;
$(window).bind("load resize scroll",function(e) {
  var mappa_details = $('#mappa-details');

  if (  (isElementInViewport(mappa_details) == true) && (stop == false) ){
    if (  (typeof google === 'object' && typeof google.maps === 'object')  ){
      drop();
      stop = true;
    }
  }
});

var OLD_LATITUDE = 34.729962;
var OLD_LONGITUDE = -86.596517;
var LATITUDE = 42.7235867;
var LONGITUDE = 12.5771678;
var CASTLE_LAT = 42.7235867;
var CASTLE_LON = 12.5771678;
var CHURCH_LAT = 42.61378;
var CHURCH_LON = 12.544201;

var map;
var center = new google.maps.LatLng(LATITUDE, LONGITUDE);

var MY_MAPTYPE_ID = 'custom_style';

function initialize() {

var featureOpts = [
{
"featureType": "landscape",
"stylers": [
{ "visibility": "on" },
{ "color": "#ffffff" }
]
},{
"featureType": "road.local",
"elementType": "labels.text",
"stylers": [
{ "visibility": "off" }
]
},{
"featureType": "road.local",
"elementType": "geometry.fill",
"stylers": [
{ "visibility": "on" },
{ "color": "#fafaf9" }
]
},{
"featureType": "road.local",
"elementType": "geometry.stroke",
"stylers": [
{ "visibility": "on" },
{ "color": "#e7e6e4" }
]
},{
"featureType": "poi",
"stylers": [
{ "visibility": "off" }
]
},{
"featureType": "administrative.locality",
"elementType": "labels.text.fill",
"stylers": [
{ "color": "#62666a" }
]
},{
"featureType": "road.arterial",
"elementType": "labels.text.fill",
"stylers": [
{ "color": "#afaead" }
]
},{
"featureType": "administrative.neighborhood",
"elementType": "labels.text.fill",
"stylers": [
{ "color": "#b7b7b7" }
]
},{
"featureType": "road.highway",
"elementType": "geometry.fill",
"stylers": [
{ "color": "#e5ebd1" }
]
},{
"featureType": "road.highway",
"elementType": "geometry.stroke",
"stylers": [
{ "visibility": "on" },
{ "color": "#bdc7a2" }
]
},{
"featureType": "water",
"stylers": [
{ "visibility": "on" },
{ "saturation": -39 }
]
},{
"featureType": "road.highway",
"elementType": "labels.text.fill",
"stylers": [
{ "visibility": "on" },
{ "color": "#646464" }
]
},{
}
];


  var mapOptions = {
    zoom: 10,
    center: center,
    scrollwheel: false,
    draggable: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID,
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

  var styledMapOptions = {
    name: 'Valeria & Luca'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  map.mapTypes.set(MY_MAPTYPE_ID, customMapType);

}

var markers = [];
var marker = [];
var iterator = 0;

var mappa_options = [
  new google.maps.LatLng(CASTLE_LAT, CASTLE_LON), //Roundhouse
  new google.maps.LatLng(CASTLE_LAT, CASTLE_LON), //Embassy
  new google.maps.LatLng(CHURCH_LAT, CHURCH_LON)  //Spring Hill
];

var pin_url = [
  '/images/marker0@2x.png?v=3',
  '/images/marker1@2x.png?v=3',
  '/images/marker2@2x.png?v=3'
]


function drop() {
  for (var i = 0; i < mappa_options.length; i++) {
    setTimeout(function() {
      addMarker();
    }, i * 200);
  }
}


function addMarker() {
  marker[iterator] = new google.maps.Marker({
    position: mappa_options[iterator],
    map: map,
    icon: { url: pin_url[iterator],
            size: new google.maps.Size(48, 74),
            scaledSize: new google.maps.Size(24, 37),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 37),
            optimized: true
          },
    draggable: false,
    zIndex: 10-iterator,
    title: 'marker'+iterator,
    animation: google.maps.Animation.DROP
  });


  google.maps.event.addListener(marker[iterator], 'click', function(e) {
    var pin_title = this.getTitle();
    mappa_info_update(pin_title);

    myWidth = window.innerWidth;
    if(myWidth < 768) {
      map.panTo(e.latLng);
    }else{
      offsetCenter(e.latLng, 200, 0);
    }
  });

  markers.push(marker[iterator]);

  iterator++;
}


function offsetCenter(latlng,offsetx,offsety) {
  var scale = Math.pow(2, map.getZoom());

  var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
  var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

  var worldCoordinateNewCenter = new google.maps.Point(
      worldCoordinateCenter.x - pixelOffset.x,
      worldCoordinateCenter.y + pixelOffset.y
  );

  var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

  map.panTo(newCenter);
}

function mapRedefine(){
  google.maps.event.trigger(map, 'resize');

  myWidth = window.innerWidth;
  if (myWidth <= 400) {
    currCenter = new google.maps.LatLng(LATITUDE + 0.000487, LONGITUDE);
    map.setZoom(9);
  } else if (myWidth <= 767){
    currCenter = new google.maps.LatLng(LATITUDE + 0.000487, LONGITUDE);
    map.setZoom(9);
  }else if(myWidth === 768){
    currCenter = new google.maps.LatLng(LATITUDE - 0.000472, LONGITUDE - 0.3);
    map.setZoom(10);
  }else{
    currCenter = center;
    map.setZoom(10);
  }

  map.setCenter(currCenter);
}

function mappa_info_update(marker_name){
  if(marker_name == 'marker2'){
    document.getElementById('marker2').style.display = 'block';
    document.getElementById('marker1').style.display = 'none';
  }else{
    document.getElementById('marker2').style.display = 'none';
    document.getElementById('marker1').style.display = 'block';
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

window.onresize = function(event) {
  mapRedefine();
};

window.onload = function () {
  mapRedefine();
}

