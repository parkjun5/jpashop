package jpabook.jpashop.repository.dto;

import jpabook.jpashop.domain.Address;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Embedded;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@ToString
public class MemberDto {
    private String name;
    @Embedded
    private Address address;

    private List<MemberTester> memberTesters = new ArrayList<>();

    public MemberDto(String name, Address address) {
        this.name = name;
        this.address = address;
    }

    public MemberDto(String name, Address address, List<MemberTester> memberTesters) {
        this.name = name;
        this.address = address;
        this.memberTesters = memberTesters;
    }
}
