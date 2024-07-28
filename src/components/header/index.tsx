import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme";
import NavigationMenuWrapper from "./navigation-menu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-evenly items-center p-2">
      <Link to="/">
        <img src="/logo.svg" alt="Brand Logo" />
      </Link>
      <NavigationMenuWrapper />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost">Log in</Button>
        <Button>Try for free</Button>
      </div>
    </header>
  );
};

export default Header;
