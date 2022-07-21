package jpabook.jpashop.domain;

import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "lightning")
public class Lightning {

    @Id @GeneratedValue
    @Column(name = "strokes_id")
    private Long id;
    private LocalDateTime createBy;
    private int nsfrac;
    private float longitude;
    private float latitude;
    private float height;
    private float intensity;
    private float observationalError;
    private Short discharge;
    private Short sensorNum;
    private float quality;
    private Long flashId;
    private Short gridX;
    private Short gridY;
    private int districtCode;

    protected Lightning() {

    }


    public static Lightning createLightning(int nsfrac, float longitude, float latitude, float height, float intensity,
                                            float observationalError, Short discharge, Short sensorNum, float quality, Long flashId, Short gridX, Short gridY, int districtCode) {
        Lightning lightning = new Lightning();
        lightning.createBy = LocalDateTime.now();
        lightning.nsfrac = nsfrac;
        lightning.longitude = longitude;
        lightning.latitude = latitude;
        lightning.height = height;
        lightning.intensity = intensity;
        lightning.observationalError = observationalError;
        lightning.discharge = discharge;
        lightning.sensorNum = sensorNum;
        lightning.quality = quality;
        lightning.flashId = flashId;
        lightning.gridX = gridX;
        lightning.gridY = gridY;
        lightning.districtCode = districtCode;

        return lightning;
    }
}