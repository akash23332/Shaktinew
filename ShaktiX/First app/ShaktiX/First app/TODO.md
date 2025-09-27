# TODO: Integrate Blockchain Retrieval for Evidence Endpoint

## Plan Breakdown
1. [x] Create TODO.md with steps from approved plan.
2. [x] Edit server.js: Update /api/evidence/:id endpoint to integrate blockchain retrieval.
   - Add logic to try blockchain first using parsed ID (timestamp from 'evidence-${timestamp}').
   - Call evidenceContract.getEvidenceById(parsedId) if contract initialized.
   - Decode and map blockchain data to evidenceRecord format.
   - Fallback to file storage if blockchain fails or no record.
   - Add source field to response ('blockchain' or 'file').
   - Handle errors with try-catch.
3. [x] Test the changes: Restart server and verify endpoint behavior.
   - Server started successfully on port 3001.
   - /api/evidence endpoint returns 3 records.
   - /api/evidence/:id endpoint works and shows "file" source (blockchain not configured).
4. [x] Update TODO.md with completion status.
5. [x] Attempt completion once verified.

Next step: Attempt completion.
