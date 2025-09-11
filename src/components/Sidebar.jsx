import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../context/AppStore";
import { useResponsive } from "../hooks/useResponsive";
import ManagementNav from "./ManagementNav";
import {
  DashboardIcon,
  CalendarIcon,
  RevenueIcon,
  ReportsIcon,
  OutsourceIcon,
  NotificationIcon,
  SettingsIcon,
  TrendUpIcon,
  EstimationIcon,
  InvoiceIcon,
  HamburgerIcon,
  LogoutIcon,
} from "./Icons";

const navigationItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: DashboardIcon,
    roles: ["Admin", "Dispatcher", "Driver"]
  },
  {
    path: "/schedule",
    label: "Schedule",
    icon: CalendarIcon,
    roles: ["Admin", "Dispatcher", "Driver"]
  },
  {
    path: "/invoices",
    label: "Invoices",
    icon: InvoiceIcon,
    roles: ["Admin", "Dispatcher"]
  },
  {
    path: "/reports",
    label: "Reports",
    icon: ReportsIcon,
    roles: ["Admin", "Dispatcher"]
  },
  {
    path: "/finance",
    label: "Estimates",
    icon: EstimationIcon,
    roles: ["Admin"]
  },
  {
    path: "/notifications",
    label: "Notifications",
    icon: NotificationIcon,
    roles: ["Admin", "Dispatcher", "Driver"]
  },
  {
    path: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    roles: ["Admin"]
  }
];

const navSections = [
  {
    heading: 'Main',
    items: navigationItems.slice(0, 2)
  },
  {
    heading: 'Management',
    items: navigationItems.slice(2, 5)
  },
  {
    heading: 'Other',
    items: navigationItems.slice(5)
  }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { currentUser, logout } = useAppStore();
  const { isMobile, isSmallMobile } = useResponsive();
  const shouldShowNavItem = (item) => item.roles.includes(currentUser?.role);
  const closeSidebarOnMobile = () => { if (isMobile) setSidebarOpen(false); };

  // Handle sidebar toggle with localStorage for desktop
  const handleSidebarToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Store manually collapsed state for desktop
    if (!isMobile && !newState) {
      localStorage.setItem('sidebarManuallyCollapsed', 'true');
    } else if (!isMobile && newState) {
      localStorage.removeItem('sidebarManuallyCollapsed');
    }
  };

  // Add body overflow control for mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, sidebarOpen]);
  const getNavLinkClasses = (isActive) =>
    `block px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
    ${isActive ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105" : "text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 hover:shadow-md"}
    ${isMobile ? 'min-h-[48px] flex items-center' : ''}
    ${!sidebarOpen && !isMobile ? 'justify-center p-3' : ''}`;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}
      {/* Mobile floating hamburger to open sidebar if closed */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-60 p-3 bg-white rounded shadow-lg"
          style={{ 
            paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)', 
            paddingLeft: 'max(env(safe-area-inset-left, 0px), 1rem)' 
          }}
          aria-label="Open sidebar"
        >
          <HamburgerIcon className="w-6 h-6" />
        </button>
      )}
      <aside
        className={
          `${sidebarOpen ? "w-64" : "w-16"} ` +
          `${isMobile && !sidebarOpen ? 'hidden' : ''} ` +
          `${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'} ` +
          `bg-white transition-all duration-300 ease-in-out ` +
          `${isMobile ? 'shadow-2xl' : 'shadow-lg'} ` +
          `border-r border-slate-200 ` +
          `${isSmallMobile && sidebarOpen ? 'w-full' : ''}`
        }
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <img src="./logo.svg" alt="logo" className="w-9 h-9 rounded shadow-sm border border-slate-200 bg-white" />
              {sidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">Priority</span>}
            </div>
            <button 
              onClick={handleSidebarToggle} 
              className={
                `px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors ` +
                `rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ` +
                `${isMobile ? 'min-h-[48px] min-w-[48px] flex items-center justify-center' : 'btn btn-outline'}`
              }
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <HamburgerIcon className="w-5 h-5" />
            </button>
          </div>
          {/* Navigation with section headings */}
          <nav className="flex-1 p-4 overflow-y-auto" aria-label="Main navigation">
            <ul className="space-y-2">
              {navSections.map(section => (
                <li key={section.heading} className="mb-2">
                  {sidebarOpen && <div className="text-xs font-semibold text-slate-400 uppercase px-2 mb-1 tracking-wider">{section.heading}</div>}
                  <ul className="space-y-1">
                    {section.items.map(item => {
                      if (!shouldShowNavItem(item)) return null;
                      const IconComponent = item.icon;
                      return (
                        <li key={item.path}>
                          <NavLink 
                            to={item.path}
                            className={({isActive}) => getNavLinkClasses(isActive)}
                            onClick={closeSidebarOnMobile}
                            tabIndex={0}
                            aria-label={item.label}
                            title={!sidebarOpen ? item.label : undefined}
                          >
                            <div className={`flex items-center ${!sidebarOpen && !isMobile ? 'justify-center' : 'justify-start'}`}>
                              <IconComponent className={`w-6 h-6 flex-shrink-0 ${!sidebarOpen && !isMobile ? '' : 'mr-3'}`} aria-hidden="true" />
                              {sidebarOpen && <span className="text-left">{item.label}</span>}
                            </div>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                  {sidebarOpen && <div className="border-b border-slate-100 my-2" />}
                </li>
              ))}
              {/* Management Section - Grouped Navigation */}
              <ManagementNav 
                currentUser={currentUser} 
                sidebarOpen={sidebarOpen} 
                onMobileClick={closeSidebarOnMobile} 
              />
            </ul>
          </nav>
          {/* User info with avatar */}
          <div className={
            `p-4 border-t border-slate-200 bg-slate-50 ` +
            `${sidebarOpen ? '' : 'text-center'} ` +
            `${isMobile ? 'min-h-[80px]' : ''}`
          }>
            {sidebarOpen ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-base border border-purple-200">
                    {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">
                      Logged in as <span className="font-semibold text-slate-800">{currentUser?.name}</span>
                    </div>
                    <div className="text-xs text-slate-500">({currentUser?.role})</div>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className={
                    `text-xs text-purple-600 hover:text-purple-800 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ` +
                    `${isMobile ? 'min-h-[48px] w-full text-left flex items-center' : ''}`
                  }
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={logout} 
                className={
                  `hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ` +
                  `${isMobile ? 'min-h-[48px] min-w-[48px] flex items-center justify-center' : ''}`
                }
                title="Logout"
                aria-label="Logout"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
