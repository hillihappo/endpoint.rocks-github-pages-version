import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">Tools</Link>
          <Link to="/blog" className="transition-colors hover:text-foreground">Blog</Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Endpoint.rocks is not affiliated with Microsoft. All tools are community-created and maintained by their respective authors.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Endpoint.rocks
        </p>
      </div>
    </footer>
  );
};

export default Footer;
