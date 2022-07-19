package jpabook.jpashop.service;

import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.domain.LightningData;
import jpabook.jpashop.repository.LightingRepository;
import jpabook.jpashop.repository.dto.CountLightning;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
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
        List<Lightning> lightnings = lightingService.findAll();
        //when
        System.out.println("++++++++++++++++++++++++++++++++++++");
        System.out.println(lightnings.get(0).getCreateBy());

        System.out.println(lightnings.get(0).getId());

        System.out.println(lightnings.get(0).getDistrict_code());
        System.out.println("++++++++++++++++++++++++++++++++++++");

        //then

        assertThat(lightnings.get(0).getGrid_x()).isNotNull();
    }

    @Test
    void findCountAllDistinctByDistrict_code() throws Exception {
        //given
        List<CountLightning> countAllDistinctByDistrict_code = lightingService.getCalculateLightnings("grid");
        //when
        System.out.println("countAllDistinctByDistrict_code = " + countAllDistinctByDistrict_code.get(0).getDistrict_code());
        System.out.println("countAllDistinctByDistrict_code = " + countAllDistinctByDistrict_code.get(0).getGeomCoordinates());

        //then
        assertThat(countAllDistinctByDistrict_code.get(0).getDistrict_code()).isNotZero();
        assertThat(countAllDistinctByDistrict_code.get(0).getGeomCoordinates()).isNotNull();


    }

}