
-- Drop ALL existing policies and recreate as explicitly PERMISSIVE

-- blog_posts
DROP POLICY IF EXISTS "Published posts are publicly readable" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins see all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;

CREATE POLICY "Published posts are publicly readable" ON public.blog_posts
  AS PERMISSIVE FOR SELECT TO public
  USING ((published_at IS NOT NULL) AND (published_at <= now()));

CREATE POLICY "Admins see all blog posts" ON public.blog_posts
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" ON public.user_roles
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- tools
DROP POLICY IF EXISTS "Tools are publicly readable" ON public.tools;
DROP POLICY IF EXISTS "Admins can insert tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can update tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can delete tools" ON public.tools;

CREATE POLICY "Tools are publicly readable" ON public.tools
  AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can insert tools" ON public.tools
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tools" ON public.tools
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tools" ON public.tools
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
