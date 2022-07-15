package jpabook.jpashop.domain;

import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;

@Getter @Setter
public class MapPointInfo {
    private int id;
    private double velocity;
    private double lon;
    private double lat;
    private LocalDate observationDate;
    private Point geom;
    private double value;

    public MapPointInfo(Double velocity, Double lon, Double lat, Point geom) {
        this.velocity = velocity;
        this.lon = lon;
        this.lat = lat;
        this.geom = geom;
    }

    public MapPointInfo(MapPointInfo basePointInfoLocalDate, LocalDate observationDate) {
        this.velocity = basePointInfoLocalDate.getVelocity();
        this.lon = basePointInfoLocalDate.getLon();
        this.lat = basePointInfoLocalDate.getLat();
        this.observationDate = observationDate;
        this.geom = basePointInfoLocalDate.getGeom();
    }
}
