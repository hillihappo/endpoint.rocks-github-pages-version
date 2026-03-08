

## Fix: Blog posts invisible to non-logged-in users

### Root cause

All SELECT policies on `blog_posts` are **RESTRICTIVE** (`Permissive: No`). PostgreSQL requires ALL restrictive policies to pass. A public visitor can never satisfy the admin check, so they see nothing.

### Solution

Drop the two restrictive SELECT policies and recreate them as PERMISSIVE. This way, a visitor only needs to match ONE policy (published post check) to see content.

### Changes

1. **Database migration** -- single SQL migration:
   - `DROP POLICY "Published posts are publicly readable" ON public.blog_posts;`
   - `DROP POLICY "Admins see all blog posts" ON public.blog_posts;`
   - Recreate both as PERMISSIVE policies with the same expressions.

2. **No code changes needed** -- the frontend queries are correct already.

### Technical detail

```sql
-- Drop restrictive policies
DROP POLICY "Published posts are publicly readable" ON public.blog_posts;
DROP POLICY "Admins see all blog posts" ON public.blog_posts;

-- Recreate as permissive
CREATE POLICY "Published posts are publicly readable"
  ON public.blog_posts FOR SELECT
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Admins see all blog posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
```

