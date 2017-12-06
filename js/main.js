// main.js
	
    map = null;
	var L;
    
    const birdTowerFile = 'data/lintutornit_lly_kaikki_2017_wgs84.geojson';

    var selectedTower = {};

    if (location.href.includes('?') && location.href.includes('=')) {
         selectedTower.id = Number(location.href.split('=')[1]);
    }

    // selectedTower.id = location.href.includes('?') ? Number(location.href.split('=')[1]) : null ;

    // var societySitesFile = 'data/7500.geojson';

  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");

    ortokuva.options.minZoom = 8;

    maastokartta.setOpacity(0.65);  
    // const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

    const birdTowerMarkerOptions = {
    	radius : 4,
    	fillOpacity : 1,
    	fillColor : '#4169E1',
    	color : 'dimgray',
        stroke: false
    };


    function onEachFeature(feature, layer) {

        if (feature.properties && feature.properties.name) {
            layer.bindPopup('<b>' + feature.properties.name +'</b><br/><b>' + feature.properties.kunta +'</b><br/><a href="https://www.lly.fi/lintutornit#torni-' + feature.properties.id + '" target="_top">Tornin esittely</a>'+ '<button type="button" id="searchsubmit" class="btn-zoom-tower">Lähennä</button>', {
                maxWidth : 'auto'
                });
            }
    }                    

    function zoomToTower(LatLng,zoomLvl) {
        map.flyTo(LatLng,zoomLvl);
    }

    var birdTowers = new L.GeoJSON.AJAX( birdTowerFile, { pointToLayer : function(geoJsonPoint, latlng) {
        return L.marker(latlng);  
	   }, onEachFeature: onEachFeature});

    // birdTowers.on('data:loaded', function () {

    function onMapLoad(mapCenter, mapZoom, selectedTower) {  
        console.log(selectedTower);

        if (typeof selectedTower !== 'undefined')  {
                birdTowersAsJSON = birdTowers.toGeoJSON();

                try {
                    mapCenter = (birdTowersAsJSON.features.find(item => item.properties.id == selectedTower).geometry.coordinates).reverse();
                }
                catch(e) {
                    console.log('tornin id '+selectedTower+' linkissä mahdollisesti väärin');
                }
                
                mapZoom = 10;
                // console.log('id on' ,mapCenter, mapZoom); 
                map.setView(mapCenter, mapZoom); 
        }
        else {
            // map.setView(mapCenter, mapZoom);
            map.setView(mapCenter, mapZoom); 
            // console.log('huu' ,mapCenter, mapZoom); 
        }
        };    

    const EPSG3067 = L.TileLayer.MML.get3067Proj();
     
    var mapCenter = [67.55, 25.7];
    var mapZoom = 4;

    const defaultLayers = [maastokartta, birdTowers];

  	const initMap = {
        crs: L.TileLayer.MML.get3067Proj(),
        minZoom: 3,
        maxZoom: 14,
        layers: defaultLayers,    
        maxBounds: [[65.33,19.86],
                    [70.16,30.87]],
        //test canvas renderer,
        renderer: L.canvas(),
        prefercanvas: true                   
		};

	// const obsIcon = L.AwesomeMarkers.icon({
	// 	icon: 'binoculars', prefix: 'fa', markerColor: 'cadetblue'
	// });

    // function onMapLoad(mapCenter, mapZoom) {
    //     if (selectedTower.id)  {
    //         birdTowersAsJSON;
    //         mapCenter = (birdTowersAsJSON.features.find(item => item.properties.id == selectedTower.id).geometry.coordinates).reverse();
    //         mapZoom = 10;
    //     }
    //     map.setView(mapCenter, mapZoom);

    //     console.log('huu' ,mapCenter, mapZoom);    
    // }
				
	function init() {

    	const baseMaps = { 
    		"Taustakartta" : taustakartta,
    		"Maastokartta" : maastokartta,
        	"Ilmakuva" : ortokuva
    	};

    	const birdTowerLayer = {
    		"Lintutornit <span id='lintutornit'></span>" : birdTowers,
    	};


        map = new L.map('map_div', initMap);

        map.on('load', onMapLoad(mapCenter,mapZoom,selectedTower.id)); 

        map.attributionControl.addAttribution(' taustakartta | © LLY, lintutornit ');

        L.control.layers(baseMaps).addTo(map);

        // L.easyButton('fa-home', function(btn, map){
        //     map.setView(mapCenter, mapZoom);
        // }).addTo(map);

        var mapResetButton = L.easyButton({
            states: [{
                    stateName: 'static',        // name the state
                    icon:      'fa-expand',               // and define its properties
                    title:     'Palauta kartta alkunäkymään',      // like its title
                    onClick: function(btn, map) {       // and its callback
                        map.setView(mapCenter, mapZoom);
                        map.eachLayer(function(layer){
                            map.removeLayer(layer);
                        });

                        defaultLayers.forEach(function(layer){
                            layer.addTo(map);
                        });  
                    }                         
                    }]
        });
        mapResetButton.addTo(map);

        birdTowers.addTo(map);

        map.on('popupopen', function(e) {
            $(".btn-zoom-tower").click(function() {
                var zoomLatLng = e.popup.getLatLng();
                console.log(zoomLatLng);

                // var popupSourceFeature = e.popup._source;
                // var coords = getCoords(EPSG3067.project(popupSourceFeature._latlng).toString());


                        //should really fix this, no logic here
                        // map.removeLayer(sites);
                        
                        zoomToTower(zoomLatLng,13);

                        // map.once('moveend', function() {
                        //     map.addLayer(sites);
                        //     map.addLayer(ownsites);
                        // });  

                map.closePopup();
            });
        });

        

        // $("#btn-zoom-tower").click(function(){
        //         console.log('zomiaian');
        //         zoomToTower(12);
        //     });

    };