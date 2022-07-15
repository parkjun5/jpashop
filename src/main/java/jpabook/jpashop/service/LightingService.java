package jpabook.jpashop.service;

import com.google.gson.JsonArray;
import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.repository.LightingRepository;
import jpabook.jpashop.repository.dto.CountLightning;
import jpabook.jpashop.util.ConverterUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LightingService {

    private final LightingRepository lightingRepository;
    private final ConverterUtil converterUtil;

    public List<Lightning> findAll() {
        return lightingRepository.findAll();
    }

    public List<CountLightning> getCalculateLightnings() {
        List<CountLightning> countLightnings = lightingRepository.findAllDistinctAndCountByDistrict_code();
        Map<String, JsonArray> lightningData = converterUtil.readShpOrJson();

        countLightnings.forEach(countLightning -> {
            String stringCode = Integer.toString(countLightning.getDistrict_code());
            countLightning.setGeomCoordinates(lightningData.get(stringCode));
        });

        return countLightnings;
    }

}
