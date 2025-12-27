-- Fix invalid JSON data in HelpRequests table
UPDATE HelpRequests 
SET offers = NULL 
WHERE offers = '' OR offers IS NULL OR offers = 'null';

UPDATE HelpRequests 
SET timeline = NULL 
WHERE timeline = '' OR timeline IS NULL OR timeline = 'null';

-- Set default values for JSON columns
UPDATE HelpRequests 
SET offers = '[]' 
WHERE offers IS NULL;

UPDATE HelpRequests 
SET timeline = '[]' 
WHERE timeline IS NULL;
