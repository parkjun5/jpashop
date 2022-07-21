package jpabook.jpashop.repository;

import jpabook.jpashop.domain.Lightning;
import jpabook.jpashop.repository.dto.CountLightning;
import jpabook.jpashop.repository.dto.GridValues;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LightingRepository {

    private final EntityManager em;

    public List<Lightning> findAll() {
        return em.createQuery("select l from Lightning l where l.districtCode > 1", Lightning.class)
                .setMaxResults(10)
                .getResultList();
    }

    public List<CountLightning> findAllDistinctAndCountByDistrictCode() {
        return em.createQuery(
                        "select new jpabook.jpashop.repository.dto.CountLightning(l.districtCode, count(l.districtCode)) from Lightning l " +
                                "where l.districtCode > 1 group by l.districtCode"
                        , CountLightning.class)
                .getResultList();
    }

    public List<GridValues> findGridXAndGridY() {
        return em.createQuery(
                        "select new jpabook.jpashop.repository.dto.GridValues(l.gridX,l.gridY) from Lightning l "
                        , GridValues.class)
                .getResultList();
    }

    public Long save(Lightning lightning) {
        em.persist(lightning);
        return lightning.getId();
    }

    public Lightning findById(Long savedId) {
        return em.find(Lightning.class, savedId);
    }
}
