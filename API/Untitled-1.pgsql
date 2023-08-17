DELETE FROM "AspNetUsers"
WHERE "Id" IN (
    SELECT "Id"
    FROM "AspNetUsers"
    ORDER BY "Id"
    LIMIT 3 OFFSET 2
);
