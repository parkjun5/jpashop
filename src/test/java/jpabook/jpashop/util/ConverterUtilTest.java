package jpabook.jpashop.util;

import com.google.gson.JsonArray;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
@Transactional
class ConverterUtilTest {

    @InjectMocks
    ConverterUtil converterUtil;



    @Test
    void readGeoJsonTest() throws Exception {
        //given
        Map<String, JsonArray> result = converterUtil.readDongJson();
        //when

        //then
        assertThat(result.get("1103064")).isNotNull();
    }

}