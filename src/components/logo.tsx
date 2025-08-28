import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";
import { Link } from "react-router";
import { useTheme } from "@/utils/Theme";
// import { useSession } from "@/providers/SessionProvider";

export default function Logo() {
  const { darkMode } = useTheme();
  // const { user } = useSession();
  return (
    <Link to="/" className="flex items-center space-x-2">
      {/* Logo image: smaller on mobile, larger on desktop */}
      <img
        src={darkMode ? LogoDark : LogoLight}
        alt="Logo"
        className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
      />
      {/* Text: hidden on small screens */}
      {/* <span className="hidden sm:inline text-xl font-semibold text-foreground">
        originally
      </span> */}
    </Link>
  );
}
