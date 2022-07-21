package jpabook.jpashop.util;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class JsonDongProperties {
    @JsonProperty("BASE_DATE")
    private String baseDate;
    @JsonProperty("ADM_DR_CD")
    private String admDrCd;
    @JsonProperty("ADM_DR_NM")
    private String admDrNm;
}
