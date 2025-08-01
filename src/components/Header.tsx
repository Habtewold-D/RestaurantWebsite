"use client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { user, role } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  if (!user) return null;

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-orange-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-orange-700 hover:text-orange-800 transition">
            🍽️ Restaurant
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`font-medium transition ${isActive("/") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              Home
            </Link>
            <Link
              href="/menu"
              className={`font-medium transition ${isActive("/menu") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className={`font-medium transition ${isActive("/orders") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}
            >
              Orders
            </Link>
            <Link href="/about" className={`font-medium transition ${isActive("/about") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              About
            </Link>
            {role === "admin" && (
              <Link href="/admin" className={`font-medium transition ${isActive("/admin") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
                Admin
              </Link>
            )}
          </nav>

          {/* User Info, Cart, and Logout */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-700 hover:text-orange-600 transition">
              <span className="text-2xl">🛒</span>
              {cart.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-orange-400 to-rose-400 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-rose-500 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-orange-200">
          <nav className="flex flex-col space-y-2">
            <Link href="/" className={`font-medium transition py-2 ${isActive("/") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              Home
            </Link>
            <Link href="/menu" className={`font-medium transition py-2 ${isActive("/menu") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              Menu
            </Link>
            <Link href="/orders" className={`font-medium transition py-2 ${isActive("/orders") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              Orders
            </Link>
            <Link href="/about" className={`font-medium transition py-2 ${isActive("/about") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              About
            </Link>
            <Link href="/cart" className={`font-medium transition py-2 flex items-center ${isActive("/cart") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
              Cart
              {cart.itemCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            {role === "admin" && (
              <Link href="/admin" className={`font-medium transition py-2 ${isActive("/admin") ? "text-orange-600 font-bold underline" : "text-gray-700 hover:text-orange-600"}`}>
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 