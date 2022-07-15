function initProj() {
    // 경위도
    proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');

    // google 좌표계
    proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');

    // UTM-K 좌표계
    proj4.defs('EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

    // 중부원점(Bessel)
    proj4.defs('EPSG:2097', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs');

    // 보정된 중부원점(Bessel)
    proj4.defs('EPSG:5174', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');

    // 중부원점(GRS80) [200,000 500,000]
    proj4.defs('EPSG:5181', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs');

    // 중부원점(GRS80) [200,000 600,000]
    proj4.defs('EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs');
}

    const generateMap = (inputLayers) => {
    const newMap = new ol.Map({
        controls: ol.control.defaults()
            .extend([new CustomControl()]),
        target: 'map',
        layers: inputLayers,
        view: new ol.View({
            center: [127.9, 36.5], //ol.proj.transform([127.9, 36.5],, 'EPSG:4326', 'EPSG:3857'),
            projection: 'EPSG:4326',
            zoom: 12,
            // extent: [127.0, 33, 135.0, 39.0], //ol.proj.transformExtent([100.0, -15, 134.0, 45.0], 'EPSG:4326', 'EPSG:3857'),
            maxZoom: 14,
            minZoom: 6
        })
    });
    view = newMap.getView();
    return newMap;
}

const generateOSMTileLayer = () => {
    return new ol.layer.Tile({
        title: 'open_street',
        layerId: 'base-Map',
        preload: Infinity,
        visible: true,
        type: 'base',
        zIndex: 1,
        source: new ol.source.OSM()
    })
}

const generateBingMapTileLayer = () => {
    return new ol.layer.Tile({
        title: 'bing_map',
        layerId: 'bingMapLayer',
        visible: true,
        preload: Infinity,
        type: 'base',
        zIndex: 1,
        source: new ol.source.BingMaps({
            key: bingMapApiKey,
            imagerySet: 'AerialWithLabelsOnDemand',
            maxZoom: 17,
            minZoom: 3
        })
    });
}

const generateVectorLayer = () => {
    const vectorSource = new ol.source.Vector({wrapX: false});
    vectorSource.set('id', 'polygon');

    return new ol.layer.Vector({
        layerId: 'vectorLayer',
        source: vectorSource,
        zIndex: 5,
    });
};

const generateVWorldLayers = () => {
    const layerNames = ['Base', 'gray', 'Satellite', 'midnight'];
    let baseLayers = [];

    for (const baseLayerIdx in layerNames) {
        const layerName = layerNames[baseLayerIdx];
        let fileExtension = '.png';

        if (layerName === 'Satellite') {
            fileExtension = '.jpeg'
        }

        baseLayers.push(new ol.layer.Tile({
                title: 'vworld_'.concat(layerName),
                layerId: 'vworld-'.concat(layerName, '-Map'),
                visible: true,
                type: 'base',
                zIndex: 1,
                source: new ol.source.XYZ({
                    url: 'http://api.vworld.kr/req/wmts/1.0.0/'.concat(apiKey, "/", layerName, "/{z}/{y}/{x}", fileExtension),
                    crossOrigin: 'anonymous'
                })
            })
        );
        baseLayers[baseLayerIdx].set("name", baseLayers[baseLayerIdx].A.title);
    }
    return baseLayers;
}

const changeCoordinatesByProjection = (coordinate) => {
    return ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
};

const findOneLayerFromLayers = (layerId) => {
    let resultLayer;
    map.getLayers().forEach( layer => {
        if ( layer.get('layerId') === layerId) {
            resultLayer = layer;
            return false;
        }
    });
    if (resultLayer === undefined) {
        resultLayer = generateVectorLayer();
        map.addLayer(resultLayer);
    }
    return resultLayer;
}

const updateLayerByZoomLevel = (movedZoom) => {
    const mapLayers = map.getAllLayers();
    const pointTileLayerId = 'pointTileLayer';
    const clickablePointStr = 'clickablePointLayer';
    mapLayers.forEach(layer => {
        const needToUpdateClickLayer =  movedZoom > 16;
        const isPointTileLayer =  layer.get('layerId') === pointTileLayerId;
        const isClickablePointLayer = layer.get('layerId') === clickablePointStr;
        if (!isPointTileLayer && !isClickablePointLayer) { return; }
        const layerTitles = layer.get('title').split(":");

        if ( needToUpdateClickLayer ) {
            getFeatureData(layerTitles[0], layerTitles[1]);
            // addLayerToMap(subsidence_layer, 'pointTileLayer');
            // setMapClickEvent(subsidence_layer);
        }
    })
}

const addLayerToMap = (layer, layerId) => {
    layer.set('name', layerId);
    map.addLayer(layer);
}

const resetMapEvent = (eventName) => {
    map.un(eventName, singleClickCallBackFun);
    map.on(eventName, singleClickCallBackFun);
}

function setMapClickEvent(inputSource) {
    eventSource = inputSource;
    map.on('singleclick', singleClickCallBackFun);
}

const moveZoomLevel = () => {
    let zoom = map.getView().getZoom();
    let center = map.getView().getCenter();

    map.on('moveend', () => {
        const movedZoom = map.getView().getZoom();
        const movedCenter = map.getView().getCenter();
        if (zoom !== movedZoom) {
            updateLayerByZoomLevel(movedZoom);
            zoom = movedZoom;
        }
        if (center !== movedCenter) {
            center = movedCenter;
        }
    });
}

const generatePolygonCookie = (name, value) => { document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value); }

const deletePolygonCookie = (name) => {
    let date = new Date();
    date.setDate(date.getDate() - 100);
    document.cookie = `${name}=;Expires=${date.toUTCString()}`;
}

const removeLayerByLayerId = (layerId) => {
    map.getAllLayers().forEach(layer => {
        if (layer.get("layerId") === layerId) {
            map.removeLayer(layer);
        }
    })
}

const moveZoomToCenter = (centerCoordinate) => {
    const center =  ol.proj.transform([centerCoordinate['lon'], centerCoordinate['lat']], 'EPSG:4326', 'EPSG:3857');
    map.getView().setCenter(center);
    map.getView().setZoom(17);
}

const getBaseMap = () => {
    const layerSource = new ol.source.TileWMS({
        url: geoserverUrl + '/landslidencam/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            crossOrigin: 'anonymous',
            tiled: true,
            'LAYERS': 'landslidencam:kor_dong_map_by_lonlat',
        },
        serverType: 'geoserver',
        projection: 'EPSG:4326'
    });

    return new ol.layer.Tile({
        source: layerSource,
        layerId: 'baseMap',
        title: 'baseMap',
        visible: true,
        zIndex: 100
    });
}

