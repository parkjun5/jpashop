package jpabook.jpashop.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookForm {

    private String name;
    private int price;
    private int stockQuantity;
    private String author;
    private String isbn;
}
