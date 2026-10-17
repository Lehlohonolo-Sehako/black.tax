package tax.black.core.blacktax;

import java.time.Clock;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** One clock for every date decision. `blacktax.clock.fixed` pins it for demos and tests (ISO instant). */
@Configuration
public class ClockConfig {

    @Bean
    public Clock clock(@Value("${blacktax.clock.fixed:}") String fixed) {
        return fixed.isBlank() ? Clock.system(M.SAST) : Clock.fixed(Instant.parse(fixed), M.SAST);
    }
}
