package jpabook.jpashop.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jpabook.jpashop.domain.MapPointInfo;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.geotools.data.shapefile.dbf.DbaseFileHeader;
import org.geotools.data.shapefile.dbf.DbaseFileReader;
import org.geotools.data.shapefile.files.ShpFiles;
import org.geotools.data.shapefile.shp.ShapefileReader;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.charset.Charset;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Component
public class ConverterUtil {

    public MapPointInfo constructLandSubsidenceBase(DbaseFileHeader header, ShapefileReader.Record recordShape, Object[] shapeFileDataValues, int dataNumFields) {
        Point geom = (Point) recordShape.shape();
        Double velocity = null;
        Double lon = null;
        Double lat = null;

        for (int iField = 0; iField < dataNumFields; ++iField) {
            if (header.getFieldName(iField).equals("velocity")) {
                velocity = (Double) shapeFileDataValues[iField];
            } else if (header.getFieldName(iField).equals("lon")) {
                lon = (Double) shapeFileDataValues[iField];
            } else if (header.getFieldName(iField).equals("lat")) {
                lat = (Double) shapeFileDataValues[iField];
            }
            if (velocity != null && lon != null && lat != null) {
                break;
            }
        }

        return new MapPointInfo(velocity, lon, lat, geom);
    }

    public static Map<String, Map<String, String>> convertPropertiesToJson() {
        String[] languages = {"", "vi", "en", "ko", "ko-KR"};
        Map<String, Map<String,String>> result = new HashMap<>();

        for (String language : languages) {
            Map<String,String> properties = new HashMap<>();
            String propertiesName = language.equals("") ? "messages" : "messages_";
            ResourceBundle bundle = ResourceBundle.getBundle("message_source/".concat(propertiesName).concat(language));
            for(var eachProperty : bundle.keySet()) {
                properties.put(eachProperty, bundle.getString(eachProperty));
            }
            result.put(language, properties);
        }

        return result;
    }

    public List<MapPointInfo> readShp() {
        List<MapPointInfo> landSubsidencePointInfos = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        GeometryFactory geometryFactory = new GeometryFactory();
        ShpFiles shpFile = null;

        try {
            shpFile = new ShpFiles("D:/mapDatas/vietnamHochiminh/out_InSARSelectMasterPS_20211225210848_rsp_PS_60_0.shp");
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        assert shpFile != null;
        try (DbaseFileReader dbaseFileReader = new DbaseFileReader(shpFile, false, Charset.defaultCharset());
             ShapefileReader shapeFileReader = new ShapefileReader(shpFile, true, false, geometryFactory)) {

                while(dbaseFileReader.hasNext()) {
                     ShapefileReader.Record recordShape = shapeFileReader.nextRecord();
                     DbaseFileHeader header = dbaseFileReader.getHeader();
                     Object[] shapeFileDataValues = dbaseFileReader.readEntry();
                     int dataNumFields = header.getNumFields();

                     MapPointInfo basePointInfo = constructLandSubsidenceBase(header, recordShape, shapeFileDataValues, dataNumFields);

                     for (int iField = 0; iField < dataNumFields; ++iField) {
                         if (header.getFieldName(iField).toLowerCase().startsWith("d_")) {
                             String observationDateStr = header.getFieldName(iField).substring(2);
                             LocalDate observationDate = LocalDate.parse(observationDateStr, formatter);
                             MapPointInfo pointInfo = new MapPointInfo(basePointInfo, observationDate);
                             pointInfo.setValue((Double) shapeFileDataValues[iField]);
                             landSubsidencePointInfos.add(pointInfo);
                         }
                     }
                }
             } catch (IOException e) {
            e.printStackTrace();
        }

        return landSubsidencePointInfos;
    }

    public Polygon generatePolygonByCoordinates(String strCoordinates) {
        GeometryFactory geometryFactory = new GeometryFactory();


        List<List<Double>> transCoordinates =  Arrays.stream(strCoordinates.split("and"))
                .map(eachPoint -> Arrays.stream(eachPoint.split("comma"))
                        .map(each -> (double)Math.round(Double.parseDouble(each) * 1000 ) / 1000)
                        .collect(Collectors.toList()))
                .collect(Collectors.toList());
        ArrayList<Coordinate> points = new ArrayList<>();

        for (List<Double> transCoordinate : transCoordinates) {
            points.add(new Coordinate(transCoordinate.get(0), transCoordinate.get(1)));
        }

        return geometryFactory.createPolygon(points.toArray(new Coordinate[] {}));
    }


    public Map<String, JsonArray> readShpOrJson() {
        try (BufferedReader br = new BufferedReader(new FileReader("D:\\data\\jsonConvert\\ee.geojsonl.json"))) {
            return readAndConvert(br);
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public Map<String, JsonArray> readAndConvert(BufferedReader br) throws IOException {
        String line;
        Map<String,JsonArray> dataMap= new HashMap<>();

        while ((line = br.readLine()) != null) {
            JsonObject jsonObject = JsonParser.parseString(line).getAsJsonObject();
            String admDrCd = jsonObject.get("properties").getAsJsonObject().get("ADM_DR_CD").getAsString();
            JsonArray geomCoordinates = jsonObject.get("geometry").getAsJsonObject().get("coordinates").getAsJsonArray();
            dataMap.put(admDrCd, geomCoordinates);
        }
        return dataMap;
    }
}