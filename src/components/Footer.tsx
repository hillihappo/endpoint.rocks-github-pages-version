const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto px-4 text-center">
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
