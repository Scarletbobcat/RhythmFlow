package com.rhythmflow.eureka;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class EurekaServerApplicationTests {

	private final ApplicationContext applicationContext;
	public EurekaServerApplicationTests(ApplicationContext applicationContext) {
		this.applicationContext = applicationContext;
	}

	@Test
	void contextLoads() {
		assertNotNull(applicationContext, "The application context should not be null");
	}

}
