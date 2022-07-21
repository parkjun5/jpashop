package jpabook.jpashop.service;

import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.repository.LightingRepository;
import jpabook.jpashop.repository.dto.CountLightning;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class LightingServiceTest {

    @Autowired
    LightingService lightingService;
    @Autowired
    LightingRepository lightingRepository;

    @Test
    void 값가져오기() throws Exception {
        //given
        Lightning lightning = Lightning.createLightning(1, 36.1F, 121F, 13F, 12F,
                (float) 1F, (short) 1, (short) 6, 1F,  12311L, (short) 22, (short) 22,33);
        Long savedId = lightingService.save(lightning);
        //then
        Lightning findLightning = lightingService.findById(savedId);

        //then
        assertThat(findLightning.getGridX()).isEqualTo(lightning.getGridX());
    }

    @Test
    void findCountAllDistinctByDistrict_code() throws Exception {
        //given
        Lightning lightning = Lightning.createLightning(1, 36.1F, 121F, 13F, 12F,
                1F, (short) 1, (short) 6, 1F,  12311L, (short) 22, (short) 22,33);
        Long savedId = lightingService.save(lightning);
        List<CountLightning> countAllDistinctByDistrict_code = lightingService.getCalculateLightnings("grid");
        //when

        //then
        assertThat(countAllDistinctByDistrict_code.get(0).getGridId()).isNotEmpty();
        assertThat(countAllDistinctByDistrict_code.get(0).getGeomCoordinates()).isNotNull();
    }
}