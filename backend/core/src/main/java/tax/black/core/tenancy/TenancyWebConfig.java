package tax.black.core.tenancy;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TenancyWebConfig implements WebMvcConfigurer {

    private final TenantAccessInterceptor interceptor;

    public TenancyWebConfig(TenantAccessInterceptor interceptor) {
        this.interceptor = interceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor).addPathPatterns("/api/stokvels/*/**", "/api/internal/stokvels/*/**");
    }
}
