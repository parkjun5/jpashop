package jpabook.jpashop.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JacksonDongJson {
    @JsonProperty("type")
    private String type;
    @JsonProperty("properties")
    private JsonDongProperties jsonDongProperties;
    @JsonProperty("geometry")
    private JsonGeometry geometry;
}
