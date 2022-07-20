package jpabook.jpashop.repository.dto;

import lombok.Data;

@Data
public class MemberTester {

    private String username;

    public MemberTester(String username) {
        this.username = username;
    }
}
