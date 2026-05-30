
-- has_role and assign_first_user_admin are used internally by RLS/triggers only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin() FROM anon, authenticated, public;

-- Drop broad listing on portfolio bucket; public files still load via CDN URLs
DROP POLICY IF EXISTS "Portfolio images are public" ON storage.objects;
