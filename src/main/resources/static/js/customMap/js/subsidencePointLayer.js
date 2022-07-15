const pointFeatureColorSelector = (pointFeature, velocity) => {
    const selectedStyle =  styleSelectorByVelocity(velocity);
    pointFeature.setStyle(selectedStyle);
    return pointFeature;
}

const multiPolygonStyle = (polygon, value) => {
    const selectedStyle =  emptyStyle(value);
    polygon.setStyle(selectedStyle);
    return polygon;
}

const emptyStyle = (value) => {
    const selectedColor = randomColor(value);
    return new ol.style.Style({
        fill: new ol.style.Fill({color:selectedColor }),
        stroke: new ol.style.Stroke({color: '#000000', width: 1})
    });
}

const styleSelectorByVelocity = (velocity) => {
    const selectedColor = colorSelectByVelocity(velocity);
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: selectedColor}),
            stroke: new ol.style.Stroke({color: '#000000', width: 1})
        })
    });
}

const randomColor = (velocity) =>  {
    if (velocity <  1) {
        return '#5e4fa2';
    } else if (velocity < 2) {
        return '#479fb3';
    } else if (velocity < 3) {
        return '#9ed8a4';
    } else if (velocity < 5) {
        return '#edf8a3';
    } else if (velocity < 7) {
        return '#feea9c'
    } else  if (velocity < 10) {
        return '#fca65d';
    } else if (velocity < 20) {
        return '#e35449';
    } else {
        return '#9e0142';
    }
}

const colorSelectByVelocity = (velocity) =>  {
    if (velocity > 18.75) {
        return '#5e4fa2';
    } else if (velocity > 12.5) {
        return '#479fb3';
    } else if (velocity > 6.25) {
        return '#9ed8a4';
    } else if (velocity > 0) {
        return '#edf8a3';
    } else if (velocity > -6.25) {
        return '#feea9c'
    } else  if (velocity > -12.5) {
        return '#fca65d';
    } else if (velocity > -18.75) {
        return '#e35449';
    } else {
        return '#9e0142';
    }
}

const downloadSHPByWFS = ( geoserverWorkspaceName, uuid, shpDownBtnId ) => {
    const wfsBaseApiUrl = geoserverUrl.concat('/', geoserverWorkspaceName, '/wfs?service=WFS');
    const wfsTypeName = geoserverWorkspaceName.concat(':', uuid);
    document.getElementById(shpDownBtnId).classList.toggle('downloadButton--loading');
    const wfsParamsUrl = '&crossOrigin=anonymous&version=1.1.0&request=GetFeature&typename='
        .concat(wfsTypeName,'&outputFormat=shape-zip&format_options=filename:', uuid, '.zip');
    fetch(wfsBaseApiUrl.concat(wfsParamsUrl))
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const aTag = document.createElement('a');
            aTag.href = blobUrl;
            aTag.download = uuid.concat('.zip');
            document.body.appendChild(aTag);
            aTag.click();
            aTag.remove();
            document.getElementById(shpDownBtnId).classList.toggle('downloadButton--loading');
        });
}

const addPointLayerToMap = (countLightning) => {
    const multiPolygons = createMultiPolygon(countLightning);
    const vectorLayer = putPolygonLayer(multiPolygons);
    addLayerToMap(vectorLayer, 'pointVectorLayer');
}

const featureToPointFeature = (findFeatures) => {
    let pointFeatures = [];
    for (let idx = 0; idx < findFeatures.length; idx++) {
        const feature = findFeatures[idx];
        const point_lon_lat = ol.proj.transform([feature.get('lon'), feature.get('lat')], 'EPSG:4326', 'EPSG:3857');
        const velocity = feature.get('vel');
        const pointFeature = new ol.Feature({
            geometry: new ol.geom.Point(point_lon_lat),
            id: feature.get('uuid'),
            vel: velocity
        });
        const styledPointFeature = pointFeatureColorSelector(pointFeature, velocity);
        pointFeatures.push(styledPointFeature);
    }
    return pointFeatures;
}

const createMultiPolygon = (countLightning) => {
    let polygons = [];
    countLightning.forEach( lightning => {
        // const districtCode = String(lightning.district_code);
        // const feature = features.at(map.get(districtCode));
        // // transCoordinate(feature.geometry.coordinates);
        const multiPolygon = new ol.Feature({
            geometry: new ol.geom.MultiPolygon(lightning.geomCoordinates),
        });
        const styledPointFeature = multiPolygonStyle(multiPolygon, lightning.cnt);
        polygons.push(styledPointFeature);
    })
    return polygons;
}

const pointLayerGenerator = (pointFeatures) => {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            features:pointFeatures
        }),
        layerId: 'pointVectorLayer',
        zIndex:999
    });
}

const putPolygonLayer = (multiPolygons) => {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            features: multiPolygons
        }),
        layerId: 'MultiPolygon',
        zIndex:999
    });
}

// const transCoordinateToKor = (coordinates) => {
//     Proj4js.defs["EPSG:5179"] = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//     Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
//     let mainProj = new Proj4js.Proj("EPSG:4326");
//     let korProj = new Proj4js.Proj("EPSG:5179");
//
//
//     const result =Proj4js.transform(korProj, mainProj, coordinates[0][0][0]);
//
//     console.log(result);
// }


const transCoordinate = (coordinates) => {
    let transCoordinates = [];
    coordinates[0][0].forEach( coordinate => {
        console.log("transform");
        var s_srs = new Proj4js.Proj("EPSG:5179");
        var t_srs = new Proj4js.Proj("EPSG:4326");
        // let korEpsg = ol.proj.get('EPSG:5179');

        let transform = ol.proj.transform(coordinate, s_srs, t_srs);
        console.log(transform);


        transCoordinates.push( ol.proj.transform(coordinate, 'EPSG:5179', 'EPSG:4326'))
    });
    return transCoordinates;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const mapAdmDrCDToIdx = (responseJson) => {
    const requestMap = new Map();
    responseJson.features.forEach( (feature, index_) => {
        requestMap.set(feature.properties.ADM_DR_CD, index_);
    })
    return requestMap;
};
