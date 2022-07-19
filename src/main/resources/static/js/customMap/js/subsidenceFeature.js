const getWMSLayer = (geoServerLayerId) => {
    const static_source_layer = new ol.source.ImageWMS({
        url: geoserverUrl + '/landslidencam/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            crossOrigin: 'anonymous',
            'LAYERS': 'landslidencam:'.concat(geoServerLayerId),
            'propertyName': 'id'
        },
        serverType: 'geoserver',
        projection: 'EPSG:3857'
    });

    let static_layer = new ol.layer.Image({
        source: static_source_layer,
        layerId: 'static_layer',
        title: geoServerLayerId,
        visible: true,
        zIndex: 2
    });

    eventSource = static_source_layer;
    static_layer.set('changeStaticLayer', geoServerLayerId);

    return static_layer;
}

const getLandSubsidenceLayer = (geoWorkspaceId, geoLayerId) => {
    const restApiUrl = geoserverUrl.concat('/', geoWorkspaceId, '/wms');
    const layerId = geoWorkspaceId.concat(':', geoLayerId);
    const land_subsidence_source_layer = new ol.source.ImageWMS({
        url: restApiUrl,
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            crossOrigin: 'anonymous',
            'LAYERS': layerId,
            'propertyName': 'id'
        },
        serverType: 'geoserver',
        projection: 'EPSG:3857'
    });

    let land_subsidence_layer = new ol.layer.Image({
        source: land_subsidence_source_layer,
        layerId: 'clickablePointLayer',
        title: geoLayerId,
        visible: true,
        zIndex: 2
    });

    eventSource = land_subsidence_source_layer;
    land_subsidence_layer.set('subsidence_layer', geoLayerId);

    return land_subsidence_layer;
}

const getLandSubsidenceVectorLayer = (geoWorkspaceId, geoLayerId) => {
    const land_subsidence_source_layer = new ol.source.TileJSON({
        url: geoserverUrl + '/gwc/service/tms/1.0.0/rest-api-test%3Asubsidence_test2@EPSG%3A4326@png'
    });

    let land_subsidence_layer = new ol.layer.Vector({
        source: land_subsidence_source_layer,
        layerId: 'subsidence_layer',
        title: geoLayerId,
        visible: true,
        zIndex: 2
    });

    eventSource = land_subsidence_source_layer;
    land_subsidence_layer.set('subsidence_layer', geoLayerId);

    return land_subsidence_layer;
}

const singleClickCallBackFun = (event) => {
    const viewResolution = view.getResolution();
    const url = eventSource.getSource().getFeatureInfoUrl(
        event.coordinate,
        viewResolution,
        'EPSG:3857',
        {
            'FORMAT':'application/json',
            'info_format':'application/json',
            'propertyName':'vel,subsidencedate,lon,lat,value',
            'feature_count':'100',
        }
    );
    document.getElementById("chartStyleStorage").classList.remove("white-background");

    if (url) {
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                const format = new ol.format.GeoJSON({ featureProjection: 'EPSG:3857' });
                const properties = format.readFeatures(responseJson);
                if (Array.isArray(properties) && properties.length) {
                    let chartTotalDate = [];
                    let chartTotalData = [];
                    const selectedPointsVelocity = properties[0].get('vel');
                    for (const index in properties) {
                        if (selectedPointsVelocity === properties[index].get('vel')) {
                            chartTotalDate.push(properties[index].get('date'));
                            chartTotalData.push(properties[index].get('value'));
                        }
                    }
                    removeData(chart);
                    addDataAndLabelsToChart(chart, chartTotalDate, chartTotalData);
                    document.getElementById("chartStyleStorage").classList.add("white-background");
                }
            });
    }
}

const callGeoServerLayerByUuid = (uuid) => {
    document.getElementById("chartStyleStorage").classList.remove("white-background");
    removeLayerByLayerId('pointVectorLayer');
    getCenterByUuid( uuid );
    getFeatureData(geoserverWorkspaceName, uuid);
};

const getCenterByUuid = ( uuid ) => {
    $(".mapSpinner").show();
    fetch('/center-coordinates', {
        method:'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
                'uuid': uuid
            }),
        })
    .then(response => response.json())
    .then((data) => {
        if ( data === null) {
            return;
        }
        moveZoomToCenter(data);
        $(".mapSpinner").hide();
    }).catch(() => {
        $(".mapSpinner").hide()
    Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error");
        })
}

const getFeatureData = (geoserverWorkspaceName, uuid) => {
    $(".mapSpinner").show();
    const wfsBaseApiUrl = geoserverUrl.concat('/', geoserverWorkspaceName, '/wfs', '?service=wfs');
    const wfsTypeName = geoserverWorkspaceName.concat(':', uuid);
    const wfsParamsUrl = '&crossOrigin=anonymous&version2.0.0&request=GetFeature&typename='
        .concat(wfsTypeName, '&propertyName=the_geom,ADM_DR_CD&outputFormat=application/json');
    fetch(wfsBaseApiUrl.concat(wfsParamsUrl))
        .then((response) => response.json())
        .then((responseJson) => {
            mappingFeatureToDB(responseJson);
            $(".mapSpinner").hide();
        }).catch( () => {
            $(".mapSpinner").hide()
        })
}

let selected = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({color: '#f70000'}),
        stroke: new ol.style.Stroke({color: '#ffffff', width: 2})
    })
});

const selectPointerMove = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    layers: function(layer) {
        return layer.get('layerId') === 'pointVectorLayer';
    },
    style: selected,
});

const selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    layers: function(layer) {
        return layer.get('layerId') === 'pointVectorLayer';
    },
    style: selected,
});

const mappingFeatureToDB = (mapType) => {
    fetch('/match/lightnings', {
        method:'POST',
        body: mapType
    })
        .then(response => response.json())
        .then(countLightning => {
            if(countLightning === null) {
                return null;
            }
            addPointLayerToMap(countLightning);
        })
};

// const getOnlyToDB = () => {
//     fetch('/lightnings', {
//         method:'GET',
//     })
//         .then(response => response.json())
//         .then(countLightning => {
//             if(countLightning === null) {
//                 return null;
//             }
//             fetch('./json/grid_json.geojsonl.json')
//                 .then(response => {
//                     console.log(response);
//                     return response.json();
//                 })
//                 .then(responseJson => {
//                     console.log(responseJson)
//                     addPointLayerToMap(countLightning, responseJson);
//                 })
//         })
// };