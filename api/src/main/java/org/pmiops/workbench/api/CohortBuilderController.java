package org.pmiops.workbench.api;

import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryOptions;
import org.pmiops.workbench.model.CriteriaListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CohortBuilderController implements CohortBuilderApiDelegate {

    @Override
    public ResponseEntity<CriteriaListResponse> getCriteriaByTypeAndParentId(String type, String parentId) {

        // Instantiates a client
        BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();

        return null;
    }
}
