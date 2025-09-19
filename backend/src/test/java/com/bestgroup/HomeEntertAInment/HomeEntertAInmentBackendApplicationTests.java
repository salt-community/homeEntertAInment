package com.bestgroup.HomeEntertAInment;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "CONVERT_API_TOKEN=test-token",
    "GEMINI_API_KEY=test-key"
})
class HomeEntertAInmentBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
