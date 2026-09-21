package com.build.vacante.support;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.hibernate.resource.jdbc.spi.StatementInspector;

/**
 * Records every SQL statement Hibernate sends during tests so we can assert the
 * application never touches Supabase CLI metadata tables.
 */
public final class SqlCaptureInspector implements StatementInspector {

    public static final List<String> STATEMENTS = new CopyOnWriteArrayList<>();

    @Override
    public String inspect(String sql) {
        if (sql != null && !sql.isBlank()) {
            STATEMENTS.add(sql);
        }
        return sql;
    }
}
