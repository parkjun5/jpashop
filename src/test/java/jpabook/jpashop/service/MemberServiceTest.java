package jpabook.jpashop.service;

import jpabook.jpashop.domain.Member;
import jpabook.jpashop.repository.MemberRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@Transactional
class MemberServiceTest {

    @Autowired MemberService memberService;
    @Autowired MemberRepository memberRepository;

    @Test
    void 회원가입() throws Exception {
        //given
        Member member = new Member();
        member.setName("testMember");
        //when
        Long joinedId = memberService.join(member);

        //then
        Member findMember = memberService.findMember(joinedId);
        assertThat(findMember).isSameAs(member);
    }

    @Test
    void 중복_회원_예외() throws Exception {
        //given
        Member member = new Member();
        member.setName("testMember");
        //when
        memberService.join(member);

        //then
        assertThrows(IllegalStateException.class,
                () -> memberService.join(member));
    }
}