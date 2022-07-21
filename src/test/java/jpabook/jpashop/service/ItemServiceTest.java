package jpabook.jpashop.service;

import jpabook.jpashop.controller.BookForm;
import jpabook.jpashop.domain.item.Book;
import jpabook.jpashop.domain.item.Item;
import jpabook.jpashop.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class ItemServiceTest {

    @Autowired ItemService itemService;
    @Autowired ItemRepository itemRepository;
    @Autowired EntityManager em;

    @Test
    void 아이템_등록() throws Exception {
        //given
        BookForm bookForm = new BookForm();
        bookForm.setName("시골 JPA");
        bookForm.setPrice(10000);
        bookForm.setStockQuantity(10);

        Book book = Book.createBook(bookForm);
        Long savedId = itemService.saveItem(book);

        //when
        Item findItem = itemService.findOne(savedId);

        //then
        assertThat(findItem).isInstanceOf(Book.class);
    }

}