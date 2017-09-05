package org.pmiops.workbench.api;

import org.pmiops.workbench.model.CriteriaListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CohortBuilderController implements CohortBuilderApiDelegate {

    @Override
    public ResponseEntity<CriteriaListResponse> getCriteriaByTypeAndParentId(String type, String parentId) {
        return null;
    }
}
