package jpabook.jpashop.domain;

import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "lightning")
public class Lightning {

    @Id
    @Column(name = "strokes_id")
    private Long id;
    private LocalDateTime createBy;
    private int nsfrac;
//    private Polygon wkt_geom;
    private float longitude;
    private float latitude;
    private float height;
    private float intensity;
    private float observational_error;
    private Short discharge;
    private Short sensor_num;
//    @ElementCollection
//    private int[] sensors;
    private float quality;
    private Long flash_id;
    private Short grid_x;
    private Short grid_y;
    private int district_code;

    protected Lightning() {

    }

    public static Lightning createLightning() {

        return null;
    }

}