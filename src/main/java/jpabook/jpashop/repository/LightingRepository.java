package jpabook.jpashop.repository;

import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.domain.LightningData;
import jpabook.jpashop.repository.dto.CountLightning;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LightingRepository {

    private final EntityManager em;


    public List<Lightning> findAll() {
        return em.createQuery("select l from Lightning l where l.district_code > 1", Lightning.class)
                .setMaxResults(10)
                .getResultList();
    }

    public List<CountLightning> findAllDistinctAndCountByDistrict_code() {
        return em.createQuery(
                        "select new jpabook.jpashop.repository.dto.CountLightning(l.district_code, count(l.district_code)) from Lightning l where l.district_code > 1 group by l.district_code"
                        , CountLightning.class)
                .getResultList();
    }

}
