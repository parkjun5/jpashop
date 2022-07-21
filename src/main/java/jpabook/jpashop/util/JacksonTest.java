package jpabook.jpashop.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JacksonTest {
    @JsonProperty("type")
    private String type;
    @JsonProperty("properties")
    private JsonProperties properties;
    @JsonProperty("geometry")
    private JsonGeometry geometry;

}
