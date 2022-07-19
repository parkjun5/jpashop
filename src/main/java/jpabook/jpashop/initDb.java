package jpabook.jpashop;

import jpabook.jpashop.controller.BookForm;
import jpabook.jpashop.domain.*;
import jpabook.jpashop.domain.item.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;

@Component
@RequiredArgsConstructor
public class initDb {

    private final InitService initService;

    @PostConstruct
    public void init() {
        initService.dbInit1();
        initService.dbInit2();
    }

    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService {
        private final EntityManager em;

        public void dbInit1() {
            Member member = createMember("memberA", "서울", "xxx로", "1123");
            em.persist(member);

            Book book1 = Book.createBook(new BookForm("JPA1 Book", 10000, 100, "김영한", "11123"));
            em.persist(book1);
            Book book2 = Book.createBook(new BookForm("JPA2 Book", 20000, 100, "김영한", "11125"));
            em.persist(book2);

            OrderItem orderItem1 = OrderItem.createOrderItem(book1, 10000, 1);
            OrderItem orderItem2 = OrderItem.createOrderItem(book2, 20000, 2);
            Delivery delivery = new Delivery();
            delivery.setAddress(member.getAddress());
            Order order = Order.createOrder(member, delivery, orderItem1, orderItem2);

            em.persist(order);

        }

        public void dbInit2() {
            Member member = createMember("memberB", "부산", "yyy로", "11");
            em.persist(member);

            Book book1 = Book.createBook(new BookForm("SPRING1 Book", 30000, 200, "토비", "1118"));
            em.persist(book1);
            Book book2 = Book.createBook(new BookForm("SPRING2 Book", 40000, 200, "토비", "1117"));
            em.persist(book2);

            OrderItem orderItem1 = OrderItem.createOrderItem(book1, 30000, 3);
            OrderItem orderItem2 = OrderItem.createOrderItem(book2, 40000, 4);
            Delivery delivery = new Delivery();
            delivery.setAddress(member.getAddress());
            Order order = Order.createOrder(member, delivery, orderItem1, orderItem2);

            em.persist(order);

        }
        private Member createMember(String name, String city, String street, String zipcode) {
            Member member = new Member();
            member.setName(name);
            member.setAddress(new Address(city, street, zipcode));
            return member;
        }
    }
}
