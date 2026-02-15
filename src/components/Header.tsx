import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Endpoint</span>
          <span className="text-xl font-bold text-foreground">.rocks</span>
        </button>

        <nav className="hidden gap-6 md:flex items-center">
          <button onClick={() => scrollTo("tools")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Community Tools
          </button>
          <button onClick={() => scrollTo("blog")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </button>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-primary transition-colors hover:text-primary/80 flex items-center gap-1">
              <Settings className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-background">
            <nav className="mt-8 flex flex-col gap-4">
              <button onClick={() => scrollTo("tools")} className="text-left text-lg text-muted-foreground hover:text-foreground">
                Community Tools
              </button>
              <button onClick={() => scrollTo("blog")} className="text-left text-lg text-muted-foreground hover:text-foreground">
                Blog
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
