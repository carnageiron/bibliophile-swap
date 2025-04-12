
-- Create a storage bucket for book covers
INSERT INTO storage.buckets (id, name)
SELECT 'book_covers', 'Book Covers'
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'book_covers'
);

-- Make the bucket public
UPDATE storage.buckets
SET public = TRUE
WHERE id = 'book_covers';

-- Set up a policy to allow authenticated users to upload files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.policies 
        WHERE bucket_id = 'book_covers' AND name = 'Allow public uploads'
    ) THEN
        INSERT INTO storage.policies (bucket_id, name, permission, definition)
        VALUES (
            'book_covers',
            'Allow public uploads',
            'INSERT',
            '(bucket_id = ''book_covers'')'
        );
    END IF;
END
$$;

-- Set up a policy to allow authenticated users to update their own files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.policies 
        WHERE bucket_id = 'book_covers' AND name = 'Allow public updates'
    ) THEN
        INSERT INTO storage.policies (bucket_id, name, permission, definition)
        VALUES (
            'book_covers',
            'Allow public updates',
            'UPDATE',
            '(bucket_id = ''book_covers'')'
        );
    END IF;
END
$$;

-- Set up a policy to allow anyone to view files
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.policies 
        WHERE bucket_id = 'book_covers' AND name = 'Allow public read'
    ) THEN
        INSERT INTO storage.policies (bucket_id, name, permission, definition)
        VALUES (
            'book_covers',
            'Allow public read',
            'SELECT',
            '(bucket_id = ''book_covers'')'
        );
    END IF;
END
$$;
