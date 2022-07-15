package jpabook.jpashop.domain;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LightningData {

    private String admDrCd;
    private JsonArray geomCoordinates;


    protected LightningData() {

    }

    public static LightningData createLightningData(String line) {
        LightningData lightningData = new LightningData();
        JsonObject jsonObject = JsonParser.parseString(line).getAsJsonObject();
        lightningData.admDrCd = jsonObject.get("properties").getAsJsonObject().get("ADM_DR_CD").getAsString();
        lightningData.geomCoordinates = jsonObject.get("geometry").getAsJsonObject().get("coordinates").getAsJsonArray();

        return lightningData;
    }

}