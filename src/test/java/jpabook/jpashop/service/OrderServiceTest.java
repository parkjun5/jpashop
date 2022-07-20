package jpabook.jpashop.service;

import jpabook.jpashop.controller.BookForm;
import jpabook.jpashop.domain.Address;
import jpabook.jpashop.domain.Member;
import jpabook.jpashop.domain.Order;
import jpabook.jpashop.domain.OrderStatus;
import jpabook.jpashop.domain.item.Book;
import jpabook.jpashop.exception.NotEnoughStockException;
import jpabook.jpashop.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
class OrderServiceTest {

    @PersistenceContext
    EntityManager em;
    @Autowired
    OrderService orderService;
    @Autowired
    OrderRepository orderRepository;

    @Test
    void 상품주문() throws Exception {
        //given
        Member member = createMember();
        Book book = createBook();

        //when
        int orderCount = 2;
        Long orderedId = orderService.order(member.getId(), book.getId(), orderCount);

        //then
        Order findOrder = orderRepository.findOne(orderedId);
        assertThat(findOrder.getMember().getName()).isEqualTo("회원1");
        assertThat(findOrder.getStatus()).isEqualTo(OrderStatus.ORDER);
        assertThat(findOrder.getOrderItems()).hasSize(1);
        assertThat(findOrder.getTotalPrice()).isEqualTo(10000 * orderCount);

        assertThat(book.getStockQuantity()).isEqualTo(10 - orderCount);
    }

    @Test
    void 주문취소() throws Exception {
        //given
        Member member = createMember();
        Book book = createBook();

        //when
        int orderCount = 3;
        Long orderedId = orderService.order(member.getId(), book.getId(), orderCount);
        orderService.cancelOrder(orderedId);

        //then
        Order canceledOrder = orderRepository.findOne(orderedId);

        assertThat(canceledOrder.getStatus()).isEqualTo(OrderStatus.CANCEL);
        assertThat(book.getStockQuantity()).isEqualTo(10);

    }

    @Test
    void 상품주문_재고수량초과() throws Exception {
        //given
        Member member = createMember();
        Book book = createBook();

        //when
        int orderCount = 11;
        Long bookId = book.getId();
        Long memberId = member.getId();

        //then
        assertThrows(NotEnoughStockException.class,
                () -> orderService.order(memberId, bookId, orderCount));
    }


    private Book createBook() {
        BookForm bookForm = new BookForm();
        bookForm.setName("시골 JPA");
        bookForm.setPrice(10000);
        bookForm.setStockQuantity(10);

        Book book = Book.createBook(bookForm);
        em.persist(book);
        return book;
    }

    private Member createMember() {
        Member member = new Member();
        member.setName("회원1");
        member.setAddress(new Address("수원시", "파크로", "123-123"));
        em.persist(member);
        return member;
    }

}