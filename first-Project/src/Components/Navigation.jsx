import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  User,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./css/Navigation.css";

function Navigation() {
  const MenuItems = [
    { id: 1, name: "My Dashboard", icon: LayoutDashboard, path: "/" },
    { id: 2, name: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
    { id: 5, name: "Profile", icon: User, path: "/Profile" },
    { id: 6, name: "Settings", icon: Settings, path: "/Settings" },
  ];

  return (
    <>
      <nav>
        {MenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.id} to={item.path} style={{ textDecoration: "none" }}>
              <div className="nav-item">
                <Icon size={30} />
                <span className="name">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
export default Navigation;