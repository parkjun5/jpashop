package jpabook.jpashop.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter

public class JsonGeometry {
    @JsonProperty("type")
    private String type;
    @JsonProperty("coordinates")
    private List<List<List<List<Float>>>> coordinates;
}
