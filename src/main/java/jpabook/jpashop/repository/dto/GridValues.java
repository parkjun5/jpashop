package jpabook.jpashop.repository.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GridValues {
    private short gridX;
    private short gridY;

    public GridValues(short gridX, short gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
    }
}
