import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Logo from "./logo";
import { useSession } from "@/providers/SessionProvider";
import { API } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import LoadingStickMan from "@/assets/StickMan Walking.gif";

export default function Header() {
  const { email, clearSession, isLoading } = useSession();
  const isSessionActive = !!email;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutUser = async () => {
    await API.METHODS.POST(
      API.ENDPOINTS.user.logout,
      { email },
      { withCredentials: true },
      {
        onSuccess: () => {
          clearSession();
          navigate("/");
        },
        onError: () => {},
      }
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className=" shadow-md backdrop-blur-md fixed top-0 left-0 right-0 w-full z-50"
    >
      <div className="mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo />
        </motion.div>

        {/* Center Nav (Desktop Only) */}
        <motion.nav
          className="hidden md:flex space-x-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {["/groups", "/assignments"].map((path, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Link to={path} className="text-foreground hover:text-primary">
                {path.includes("groups") ? "Create Group" : "Create Task"}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Right (User Actions Desktop + Mobile Menu Button) */}
        <div className="flex items-center space-x-4">
          {/* Desktop user actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <img src={LoadingStickMan} className="size-12" />
            ) : isSessionActive ? (
              <Button
                className="text-black hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
                variant="outline"
                onClick={logoutUser}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  asChild
                  className="text-black hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"  
                  variant="outline"
                >
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
                <Button 
                  asChild 
                  className="text-black hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer" 
                  variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background shadow-md overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-4">
              {/* Center nav links */}
              {["/groups", "/assignments"].map((path, index) => (
                <Link
                  key={index}
                  to={path}
                  className="text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {path.includes("groups") ? "Create Group" : "Create Task"}
                </Link>
              ))}

              {/* User Actions */}
              {isLoading ? (
                <img src={LoadingStickMan} className="size-6" />
              ) : isSessionActive ? (
                <Button
                  variant="outline"
                  className="text-black hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <div className="flex gap-x-2 justify-around w-full">

                    <Button
                      variant="outline"
                      className="text-foreground grow hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        navigate("/sign-up")
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="outline"
                      className="text-foreground grow hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        navigate("/login")
                        setMobileMenuOpen(false)
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
