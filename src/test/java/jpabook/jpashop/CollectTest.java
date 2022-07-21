package jpabook.jpashop;

import jpabook.jpashop.domain.Address;
import jpabook.jpashop.domain.Member;
import jpabook.jpashop.repository.MemberRepository;
import jpabook.jpashop.repository.MemberRepositoryOld;
import jpabook.jpashop.repository.dto.MemberDto;
import jpabook.jpashop.repository.dto.MemberTester;
import jpabook.jpashop.service.MemberService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static java.util.stream.Collectors.*;
import static jpabook.jpashop.domain.Member.createMember;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@SpringBootTest
@Transactional
class CollectTest {

    @Autowired MemberRepository memberRepository;
    @Autowired MemberService memberService;

    @Test
    @DisplayName("가짜 객체 저장 및 맴버 생성 테스트")
    void stringEquals() throws Exception {
        //given
        String memberName = "memberTest1";
        Member member = createMember(memberName, new Address("수원", "로", "123"));
//        given(memberRepository.save(any())).willReturn(1L);
//        given(memberRepository.findById(any())).willReturn(Optional.of(member));
        //when
        Long memberId = memberService.join(member);
        Member findMember = memberService.findMember(memberId);

        //then
        assertThat(memberName).isEqualTo(findMember.getName());
    }

    @Test
    @DisplayName("스트림 리스트 변환")
    void membersToMemberNames() throws Exception {
        //given
        List<Member> members = createMembers();
        //when
        List<String> list = members.stream()
                .map(Member::getName)
                .collect(toList());

        //then
        assertThat(list).hasSize(7);
        assertThat(list.get(0)).isEqualTo("member0");
    }

    @Test
    @DisplayName("맴버에서 값과 객체 매핑맵 생성")
    void membersToNameAndMemberMap() throws Exception {
        //given
        List<Member> members = createMembers();
        //when
        Map<String, List<Member>> memberMap = members.stream()
                .collect(groupingBy(Member::getName));
        //then

        assertThat(memberMap.get("member5").get(0)).isInstanceOf(Member.class);
        assertThat(memberMap.containsKey("member51")).isFalse();
    }

    @Test
    @DisplayName("맴버 매핑테스트 다 끌고온 뒤 내부에 값 넣어주기")
    void membersToGroupAndMapping() throws Exception {
        //given
        List<Member> members = createMembers();
        List<MemberDto> emptyList = members.stream()
                .map(m -> new MemberDto(m.getName(), m.getAddress()))
                .collect(toList());
        //when
        Set<Map.Entry<MemberDto, List<MemberTester>>> entries = members.stream()
                .collect(groupingBy(m -> new MemberDto(m.getName(), m.getAddress()),
                        mapping(o -> new MemberTester(o.getName()), toList())
                )).entrySet();

//        entries.forEach(e -> System.out.println("e.getKey() = " + e.getKey().toString() + "   |||      e.getValue" + e.getValue().get(0).toString()));

        List<MemberDto> allList = entries.stream()
                .map(e -> new MemberDto(e.getKey().getName(), e.getKey().getAddress(), e.getValue()))
                .collect(toList());

        assertThat(emptyList.get(0).getMemberTesters()).isEmpty();
        assertThat(allList.get(5).getMemberTesters()).isNotEmpty();
        //then
    }

    private List<Member> createMembers() {
        List<Member> members = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            members.add(createMember("member"+ i, new Address("수원", "로", "123")));
        }
        return members;
    }

}
