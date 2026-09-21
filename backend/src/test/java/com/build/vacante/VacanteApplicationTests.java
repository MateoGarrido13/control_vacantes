package com.build.vacante;

import com.build.vacante.support.LocalPostgresContainerConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(LocalPostgresContainerConfig.class)
class VacanteApplicationTests {

    @Test
    void contextLoads() {
    }

}
