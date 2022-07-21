package jpabook.jpashop.util;

import com.google.gson.JsonArray;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.as;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@Transactional
class ConverterUtilTest {

    @InjectMocks
    ConverterUtil converterUtil;


    @Test
    void readGeoJsonTest() {
        //given
        Map<String, JsonArray> result = converterUtil.readDongJson();
        //when
        Set<String> keySet = result.keySet();
        //then
        for (String key : keySet) {
            assertThat(key).isNotEmpty();
            assertThat(result.get(key)).isNotNull();
        }
    }

    @Test
    void readJacksonTest() {
        //given
        Map<String, List<List<List<List<Float>>>>> stringListMap = converterUtil.readAsJacksonGrid();

        //when
        Set<String> keySet = stringListMap.keySet();

        //then
        for (String key : keySet) {
            assertThat(key).isNotEmpty();
            assertThat(stringListMap.get(key)).isNotNull();
        }
    }



}