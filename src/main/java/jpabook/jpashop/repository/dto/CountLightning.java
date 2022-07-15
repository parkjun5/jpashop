package jpabook.jpashop.repository.dto;

import com.google.gson.JsonArray;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CountLightning {
    private int district_code;
    private Long cnt;

    private JsonArray geomCoordinates;

    protected CountLightning() {

    }
    public CountLightning(int district_code, Long cnt) {
        this.district_code = district_code;
        this.cnt = cnt;
    }
}
