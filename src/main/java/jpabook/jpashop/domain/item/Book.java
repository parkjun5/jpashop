package jpabook.jpashop.domain.item;

import jpabook.jpashop.controller.BookForm;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book extends Item {

    private String author;
    private String isbn;


    public Book(String name, int price, int stockQuantity) {
        super(name, price, stockQuantity);
    }

    //  ---- 생성 매서드  ------//

    public static Book createBook(BookForm bookForm) {
        Book book = new Book();
        book.setName(bookForm.getName());
        book.setPrice(bookForm.getPrice());
        book.setStockQuantity(bookForm.getStockQuantity());
        book.setAuthor(bookForm.getAuthor());
        book.setIsbn(bookForm.getIsbn());
        return book;
    }


}
