package jpabook.jpashop.controller;

import jpabook.jpashop.repository.dto.CountLightning;
import jpabook.jpashop.repository.dto.JacksonLighting;
import jpabook.jpashop.service.LightingService;
import jpabook.jpashop.util.ConverterUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class HelloController {
    @Value(value = "${geoserver.mapRequest.url}")
    public String geoserverUrl;

    @Value(value = "${geoserver.workspace.name}")
    private String geoserverWorkspaceName;

    @Value(value ="${bing.map.api.key}")
    private String bingMapApiKey;

    private final LightingService lightingService;

    @GetMapping("/map")
    public String hello(Model model) {
        model.addAttribute("geoserverUrl", geoserverUrl);
        model.addAttribute("geoserverWorkspaceName", geoserverWorkspaceName);
        model.addAttribute("bingMapApiKey", bingMapApiKey);
        return "map";
    }

    @ResponseBody
    @PostMapping("getLanguagesProperties")
    public Map<String, Map<String, String>> getLanguagesProperties() {
        return ConverterUtil.convertPropertiesToJson();
    }

    @ResponseBody
    @GetMapping("/match/lightnings")
    public List<CountLightning> addCountToLightning(@RequestParam String mapType) {
        return lightingService.getCalculateLightnings(mapType);
    }

    @ResponseBody
    @GetMapping("/match/jackson")
    public List<JacksonLighting> addCountToJackson(@RequestParam String mapType) {
        if(mapType.equals("grid")){
            return lightingService.jacksonGridLightnings();

        } else {
            return lightingService.jacksonDongLightnings();
        }
    }

    @ResponseBody
    @GetMapping("lightnings")
    public List<CountLightning> getLightnings() {
        return lightingService.getLightnings();
    }

}
