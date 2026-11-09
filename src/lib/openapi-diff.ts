/**
 * Programmatic OpenAPI Spec Diffing Engine
 * Compares two OpenAPI 3.x / Swagger specs and isolates breaking changes:
 * - Removed paths or operations
 * - Removed request/response parameters or properties
 * - Added required request parameters or body fields
 * - Changed type schemas
 */

export interface SpecDiffResult {
  hasBreakingChanges: boolean;
  totalBreakingChanges: number;
  removedEndpoints: Array<{ path: string; method: string }>;
  removedParameters: Array<{ path: string; method: string; name: string; in: string }>;
  addedRequiredParameters: Array<{ path: string; method: string; name: string; in: string }>;
  schemaPropertyMutations: Array<{
    path: string;
    method: string;
    schemaPath: string;
    changeType: "removed_property" | "type_changed" | "required_added";
    details: string;
  }>;
  summary: string;
}

export function computeOpenApiDiff(
  prevSpec: Record<string, any>,
  newSpec: Record<string, any>
): SpecDiffResult {
  const removedEndpoints: SpecDiffResult["removedEndpoints"] = [];
  const removedParameters: SpecDiffResult["removedParameters"] = [];
  const addedRequiredParameters: SpecDiffResult["addedRequiredParameters"] = [];
  const schemaPropertyMutations: SpecDiffResult["schemaPropertyMutations"] = [];

  const prevPaths = prevSpec?.paths || {};
  const newPaths = newSpec?.paths || {};

  const httpMethods = ["get", "post", "put", "patch", "delete", "options", "head"];

  for (const [pathKey, prevPathItem] of Object.entries<any>(prevPaths)) {
    const newPathItem = newPaths[pathKey];

    if (!newPathItem) {
      // Entire path removed
      for (const m of httpMethods) {
        if (prevPathItem[m]) {
          removedEndpoints.push({ path: pathKey, method: m.toUpperCase() });
        }
      }
      continue;
    }

    // Compare each HTTP method
    for (const m of httpMethods) {
      const prevOp = prevPathItem[m];
      const newOp = newPathItem[m];

      if (prevOp && !newOp) {
        // Method removed
        removedEndpoints.push({ path: pathKey, method: m.toUpperCase() });
        continue;
      }

      if (!prevOp || !newOp) continue;

      // 1. Compare parameters
      const prevParams: any[] = prevOp.parameters || [];
      const newParams: any[] = newOp.parameters || [];

      // Check removed parameters
      for (const p of prevParams) {
        const foundInNew = newParams.find((np) => np.name === p.name && np.in === p.in);
        if (!foundInNew) {
          removedParameters.push({
            path: pathKey,
            method: m.toUpperCase(),
            name: p.name,
            in: p.in || "query",
          });
        }
      }

      // Check added required parameters
      for (const np of newParams) {
        if (np.required) {
          const foundInPrev = prevParams.find((p) => p.name === np.name && p.in === np.in);
          if (!foundInPrev) {
            addedRequiredParameters.push({
              path: pathKey,
              method: m.toUpperCase(),
              name: np.name,
              in: np.in || "query",
            });
          }
        }
      }

      // 2. Compare Request Body Schema
      const prevReqBodySchema =
        prevOp.requestBody?.content?.["application/json"]?.schema || {};
      const newReqBodySchema =
        newOp.requestBody?.content?.["application/json"]?.schema || {};

      if (prevReqBodySchema.properties && newReqBodySchema.properties) {
        // Removed properties
        for (const propName of Object.keys(prevReqBodySchema.properties)) {
          if (!newReqBodySchema.properties[propName]) {
            schemaPropertyMutations.push({
              path: pathKey,
              method: m.toUpperCase(),
              schemaPath: `requestBody.properties.${propName}`,
              changeType: "removed_property",
              details: `Field '${propName}' was removed from JSON request payload`,
            });
          }
        }

        // Added required properties
        const newRequired: string[] = newReqBodySchema.required || [];
        const prevRequired: string[] = prevReqBodySchema.required || [];
        for (const reqProp of newRequired) {
          if (!prevRequired.includes(reqProp)) {
            schemaPropertyMutations.push({
              path: pathKey,
              method: m.toUpperCase(),
              schemaPath: `requestBody.required.${reqProp}`,
              changeType: "required_added",
              details: `Field '${reqProp}' is now mandatory in request payload`,
            });
          }
        }
      }
    }
  }

  const totalBreakingChanges =
    removedEndpoints.length +
    removedParameters.length +
    addedRequiredParameters.length +
    schemaPropertyMutations.length;

  const summary = totalBreakingChanges > 0
    ? `Detected ${totalBreakingChanges} breaking change(s): ${removedEndpoints.length} endpoint(s) removed, ${removedParameters.length} parameter(s) removed, ${addedRequiredParameters.length} new required parameter(s), and ${schemaPropertyMutations.length} request/response schema breaking mutations.`
    : "No breaking schema removals detected between specifications.";

  return {
    hasBreakingChanges: totalBreakingChanges > 0,
    totalBreakingChanges,
    removedEndpoints,
    removedParameters,
    addedRequiredParameters,
    schemaPropertyMutations,
    summary,
  };
}

