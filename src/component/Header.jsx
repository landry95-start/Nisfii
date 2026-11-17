
import React, { useState, useEffect } from "react";

import {
  User,
  Heart,
  Search,
  ShoppingCart,
  Handbag,
  Menu,
  X
} from "lucide-react";

import { Link, NavLink } from "react-router-dom";
import { useCart } from "../component/CartProvider";

const navLinks = [
  { id: 1, label: "Accueil", href: "/home" },
  { id: 2, label: "Homme", href: "/homme" },
  { id: 3, label: "Femme", href: "/femme" },
  { id: 4, label: "Articles", href: "/article" },
  { id: 5, label: "Accessoires", href: "/accessoires" },
];

const Header = () => {

  const { cart } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [admin, setAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("admin") || "null");
  });

  useEffect(() => {

    const verifierAdmin = () => {
      const adminConnecte = JSON.parse(
        localStorage.getItem("admin") || "null"
      );

      setAdmin(adminConnecte);
    };

    window.addEventListener("storage", verifierAdmin);
    window.addEventListener("adminAuthChanged", verifierAdmin);

    return () => {
      window.removeEventListener("storage", verifierAdmin);
      window.removeEventListener("adminAuthChanged", verifierAdmin);
    };

  }, []);

  const totalArticles = cart.reduce((total, article) => {
    return total + Number(article.quantity || 0);
  }, 0);

  const linkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-[#D93668] font-bold"
        : "text-gray-700 hover:text-[#D93668]"
    }`;

  return (
    <header className="relative z-50 bg-pink-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between py-3 lg:py-4">

          <Link
            to="/home"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <Handbag className="w-8 h-8 md:w-9 md:h-9 text-pink-500" />

            <div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-wide">
                NISFi
              </h3>

              <p className="text-[8px] md:text-[9px] tracking-[2px]">
                NOS ACCESSOIRES
              </p>
            </div>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => (
                <li key={link.id} className="text-sm font-medium">
                  <NavLink to={link.href} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-2 border border-gray-400 rounded-full px-4 bg-white/50">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-40 xl:w-52 h-9 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">

            <Link
              to={admin ? "/admin" : "/login"}
              aria-label={admin ? "Mon espace administrateur" : "Connexion"}
              title={admin ? "Dashboard Admin" : "Se connecter"}
              className="hover:text-pink-600 transition"
            >
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            <Link
              to="/home"
              aria-label="Mes favoris"
              className="relative hover:text-pink-600 transition"
            >
              <Heart className="w-5 h-5 md:w-6 md:h-6" />

              <span className="absolute -top-2 -right-2 flex items-center justify-center bg-pink-600 text-white text-[10px] rounded-full min-w-4 h-4 px-1">
                0
              </span>
            </Link>

            <Link
              to="/cart"
              aria-label="Mon panier"
              className="relative hover:text-pink-600 transition"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />

              <span className="absolute -top-2 -right-2 flex items-center justify-center bg-pink-600 text-white text-[10px] rounded-full min-w-4 h-4 px-1">
                {totalArticles}
              </span>
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-pink-200 transition"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-pink-100">

          <div className="max-w-7xl mx-auto px-5 py-5 space-y-5">

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4">
              <Search className="w-5 h-5 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full h-11 outline-none text-sm"
              />
            </div>

            <nav>
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.id} className="border-b border-gray-100">
                    <NavLink
                      to={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block py-3 text-sm ${
                          isActive
                            ? "text-pink-600 font-bold"
                            : "text-gray-700"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              to={admin ? "/admin" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-sm text-pink-700 font-semibold py-2"
            >
              <User className="w-5 h-5" />
              {admin ? "Dashboard Admin" : "Se connecter"}
            </Link>

          </div>
        </div>
      )}

    </header>
  );
};

export default Header;






/*

rien = mobile par defaut

sm : 640px -- 767px (telephone mobile)

md : [768px---1023px] (c'est sur tablette)

lg : [1024px --- 1280px] (desktop)



La methode reduce des tableaux en js est une methode qui permet de reduire un tableau a une seule valeur en appliquant une fonction sur chaque element du tableau.

En gros reduce() permet d'additionner les valeurs d'un tableau

Exemple :

const nombres = [10, 20, 30, 40];

const somme = nombres.reduce((accumulateur, actuel) => {
    
    return accumulateur + actuel;

},0)



Comment cela se déroule pas à pas (avec valeur initiale 0) :

1. Tour 1 : accumulateur = 0, actuel = 10 → retourne 10
2. Tour 2 : accumulateur = 10, actuel = 20 → retourne 30
3. Tour 3 : accumulateur = 30, actuel = 30 → retourne 60
4. Tour 4 : accumulateur = 60, actuel = 40 -> retoune 100

 
3. Sans valeur initiale

Si vous omettez la valeur initiale, reduce() utilise le premier élément du tableau 

comme valeur de départ pour l'accumulateur et commence la boucle au 2ème élément (index 1)


*/