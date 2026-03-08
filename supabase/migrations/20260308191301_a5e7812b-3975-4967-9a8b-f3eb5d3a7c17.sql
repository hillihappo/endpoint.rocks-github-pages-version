
-- Fix blog_posts SELECT policies: drop restrictive, create permissive
DROP POLICY IF EXISTS "Published posts are publicly readable" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins see all blog posts" ON public.blog_posts;

CREATE POLICY "Published posts are publicly readable"
  ON public.blog_posts FOR SELECT
  USING ((published_at IS NOT NULL) AND (published_at <= now()));

CREATE POLICY "Admins see all blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix blog_posts INSERT/UPDATE/DELETE policies
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix tools SELECT policy
DROP POLICY IF EXISTS "Tools are publicly readable" ON public.tools;

CREATE POLICY "Tools are publicly readable"
  ON public.tools FOR SELECT
  USING (true);

-- Fix tools admin policies
DROP POLICY IF EXISTS "Admins can insert tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can update tools" ON public.tools;
DROP POLICY IF EXISTS "Admins can delete tools" ON public.tools;

CREATE POLICY "Admins can insert tools"
  ON public.tools FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tools"
  ON public.tools FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tools"
  ON public.tools FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
