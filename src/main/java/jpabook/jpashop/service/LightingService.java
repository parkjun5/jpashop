package jpabook.jpashop.service;

import com.google.gson.JsonArray;
import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.repository.LightingRepository;
import jpabook.jpashop.repository.dto.CountLightning;
import jpabook.jpashop.repository.dto.GridValues;
import jpabook.jpashop.repository.dto.JacksonLighting;
import jpabook.jpashop.util.ConverterUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.*;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LightingService {

    private final LightingRepository lightingRepository;
    private final ConverterUtil converterUtil;

    public List<Lightning> findAll() {
        return lightingRepository.findAll();
    }

    public Long save(Lightning lightning) {
        return lightingRepository.save(lightning);
    }

    public List<CountLightning> getCalculateLightnings(String mapType) {
        if (mapType.equals("grid")) {
            return getGridLightnings();
        } else {
            return getDongLightnings();
        }
    }

    public List<JacksonLighting> jacksonGridLightnings() {
        List<GridValues> gridValues = lightingRepository.findGridXAndGridY();
        Map<String, Integer> gridMap = converterUtil.convertXyToGridId(gridValues);
        Map<String, List<List<List<List<Float>>>>> lightningData = converterUtil.readAsJacksonGrid();
        return mappingJacksonLightnings(gridMap, lightningData);
    }

    public List<JacksonLighting> jacksonDongLightnings() {
        List<CountLightning> countLightnings = lightingRepository.findAllDistinctAndCountByDistrictCode();
        Map<String, List<List<List<List<Float>>>>> lightningData = converterUtil.readAsJacksonDong();

        return countLightnings.stream()
                .map(c -> new JacksonLighting(c.getDistrict_code(), c.getCnt(), lightningData.get(String.valueOf(c.getDistrict_code()))))
                .collect(toList());
    }

    public List<CountLightning> getGridLightnings() {
        List<GridValues> gridValues = lightingRepository.findGridXAndGridY();
        Map<String, Integer> gridMap = converterUtil.convertXyToGridId(gridValues);
        Map<String, JsonArray> lightningData = converterUtil.readGridJson();
        return mappingCountLightnings(gridMap, lightningData);
    }

    public List<CountLightning> getDongLightnings() {
        List<CountLightning> countLightnings = lightingRepository.findAllDistinctAndCountByDistrictCode();
        Map<String, JsonArray> lightningData = converterUtil.readDongJson();

        countLightnings.forEach(countLightning -> {
            String stringCode = Integer.toString(countLightning.getDistrict_code());
            countLightning.setGeomCoordinates(lightningData.get(stringCode));
        });
        return countLightnings;
    }

    public List<CountLightning> getLightnings() {
        return lightingRepository.findAllDistinctAndCountByDistrictCode();
    }

    public Lightning findById(Long savedId) {
        return lightingRepository.findById(savedId);
    }

    private List<CountLightning> mappingCountLightnings(Map<String, Integer> gridMap, Map<String, JsonArray> lightningData) {
        List<CountLightning> results = new ArrayList<>();
        gridMap.forEach((mapKey, count) -> {
            JsonArray geometry = lightningData.get(mapKey);
            if (geometry == null) {
                return;
            }

            CountLightning countLightning = new CountLightning(mapKey, Long.valueOf(count));
            countLightning.setGeomCoordinates(geometry);
            results.add(countLightning);
        });
        return results;
    }

    private List<JacksonLighting> mappingJacksonLightnings(Map<String, Integer> gridMap, Map<String, List<List<List<List<Float>>>>> lightningData) {
        List<JacksonLighting> results = new ArrayList<>();
        gridMap.forEach((mapKey, count) -> {
            List<List<List<List<Float>>>> geomCoordinates = lightningData.get(mapKey);
            if (geomCoordinates == null ) {
                return;
            }

            JacksonLighting jacksonLighting = new JacksonLighting(mapKey, Long.valueOf(count));
            jacksonLighting.setGeomCoordinates(geomCoordinates);
            results.add(jacksonLighting);
        });
        return results;
    }

}
