package tax.black.core.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tax.black.core.service.api.dto.DecisionFilterDto;

/** Query parameters bind by the spec's enum values ("Lending"), not the Java constant names ("LENDING"). */
@Configuration
public class ApiEnumConverters implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(String.class, DecisionFilterDto.class, DecisionFilterDto::fromValue);
    }
}
