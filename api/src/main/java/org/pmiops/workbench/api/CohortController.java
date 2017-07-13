package org.pmiops.workbench;

import static org.pmiops.workbench.api.Constants.V1_API_PREFIX;

import java.util.List;
import java.util.ArrayList;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;

import org.pmiops.workbench.model.Cohort;

@RestController
@RequestMapping(V1_API_PREFIX + "/workspaces/{workspaceId}/cohorts")
public class CohortController {

  @GetMapping
  public List<Cohort> listCohorts(@PathVariable Long workspaceId) {
    List<Cohort> cohorts = new ArrayList<>();
    cohorts.add(new Cohort("id1", "name1", "criteria1", "type1"));
    cohorts.add(new Cohort("id2", "name2", "criteria2", "type2"));
    return cohorts;
  }
}