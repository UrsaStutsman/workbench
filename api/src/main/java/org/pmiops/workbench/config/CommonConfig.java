package org.pmiops.workbench.config;

import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.apache.ApacheHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.Clock;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;

@Configuration
public class CommonConfig {

  @Bean
  JsonFactory jsonFactory() {
    return new JacksonFactory();
  }

  @Bean
  HttpTransport httpTransport() {
    return new ApacheHttpTransport();
  }

  @Bean
  Clock clock() { return Clock.systemUTC(); }

  @Bean
  DataSource dataSource() {
    Map<String, String> env = System.getenv();
    for (String envName : env.keySet()) {
      System.out.format("%s=%s%n", envName, env.get(envName));
    }
    if (env.get("invalid-environment-variable-name") == null) {
      System.err.println("Environment variable spring.datasource.url required");
      return null;
    }
    DataSource ds = DataSourceBuilder.create().build();
    Connection c = null;
    try {
      c = ds.getConnection();
    } catch (SQLException e) {
      System.err.format("Failed to establish database connection: %s%n", e);
      return null;
    }
    PreparedStatement ps = null;
    try {
      ps = c.prepareStatement("select true;");
    } catch (SQLException e) {
      System.err.format("Failed to prepare test SQL statement: %s", e);
    }
    try {
      ps.execute();
    } catch (SQLException e) {
      System.err.format("Failed to execute test SQL statement: %s", e);
    }
    return ds;
  }
}
