package jpabook.jpashop.repository.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class JacksonLighting {
    private int districtCode;
    private Long cnt;
    private String gridId;

    private List<List<List<List<Float>>>> geomCoordinates;

    protected JacksonLighting() {

    }


    public JacksonLighting(int districtCode, Long cnt, List<List<List<List<Float>>>> geomCoordinates) {
        this.districtCode = districtCode;
        this.cnt = cnt;
        this.geomCoordinates = geomCoordinates;
    }

    public JacksonLighting(String gridId, Long cnt) {
        this.gridId = gridId;
        this.cnt = cnt;
    }
}
