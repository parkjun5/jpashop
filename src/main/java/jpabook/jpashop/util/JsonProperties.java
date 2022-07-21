package jpabook.jpashop.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class JsonProperties {
    @JsonProperty("GRID_ID")
    private String gridId;
    @JsonProperty("X-coord")
    private String xCoord;
    @JsonProperty("Y-coord")
    private String yCoord;
}
