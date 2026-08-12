import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { DjangoNavbarItem } from '../../types';
import { navbarService } from '../../services/navbarService';

interface NavbarNavigationProps {
  onNavigate?: (url: string) => void;
  isMobile?: boolean;
  onCloseMobileMenu?: () => void;
}

export const NavbarNavigation: React.FC<NavbarNavigationProps> = React.memo(
  ({ onNavigate, isMobile = false, onCloseMobileMenu }) => {
    const [navbarItems, setNavbarItems] = useState<DjangoNavbarItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
      let isMounted = true;

      async function fetchNavbar() {
        setLoading(true);
        setError(false);
        try {
          const items = await navbarService.getNavbarItems();
          if (isMounted) {
            setNavbarItems(items);
            setLoading(false);
          }
        } catch {
          if (isMounted) {
            setError(true);
            setLoading(false);
          }
        }
      }

      fetchNavbar();

      return () => {
        isMounted = false;
      };
    }, []);

    // Skeleton loader
    if (loading) {
      if (isMobile) {
        return (
          <div className="space-y-3 py-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-slate-100 rounded-xl w-full" />
            ))}
          </div>
        );
      }
      return (
        <div className="flex items-center gap-6 py-1 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-6 w-24 bg-slate-100 rounded-lg" />
          ))}
        </div>
      );
    }

    if (error || navbarItems.length === 0) {
      // Empty / Error state (No fake fallback categories displayed)
      return null;
    }

    if (isMobile) {
      return (
        <div className="flex flex-col space-y-1">
          {navbarItems.map((item) => (
            <MobileNavbarAccordionItem
              key={item.id}
              item={item}
              onNavigate={onNavigate}
              onCloseMenu={onCloseMobileMenu}
            />
          ))}
        </div>
      );
    }

    return (
      <nav className="flex items-center gap-5 xl:gap-7 text-sm font-medium relative">
        {navbarItems.map((item, idx) => (
          <DesktopNavbarMenuItem
            key={item.id}
            item={item}
            isLastItem={idx >= navbarItems.length - 2}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    );
  }
);

NavbarNavigation.displayName = 'NavbarNavigation';

// Desktop Navbar Item
interface DesktopNavbarMenuItemProps {
  item: DjangoNavbarItem;
  isLastItem?: boolean;
  onNavigate?: (url: string) => void;
}

const DesktopNavbarMenuItem: React.FC<DesktopNavbarMenuItemProps> = ({
  item,
  isLastItem,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasChildren = Boolean(item.children && item.children.length > 0);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (hasChildren) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const targetUrl = item.url || item.link_url || `#${item.slug || 'nav'}`;

  const handleClick = (e: React.MouseEvent) => {
    const destination = item.url || item.link_url;
    if (destination) {
      e.preventDefault();
      onNavigate?.(destination);
    }
  };

  return (
    <div
      className="relative group py-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={targetUrl}
        onClick={handleClick}
        className={`flex items-center gap-1.5 text-slate-700 hover:text-[#0D7366] font-medium text-sm transition-colors py-1 px-1.5 rounded-lg group-hover:bg-[#0D7366]/5 ${
          isOpen ? 'text-[#0D7366] font-semibold' : ''
        }`}
      >
        {item.icon && (
          <span className="material-symbols-outlined text-lg text-[#0D7366] opacity-80 group-hover:opacity-100 transition-opacity">
            {item.icon}
          </span>
        )}
        <span>{item.title}</span>

        {item.badge_text && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
            {item.badge_text}
          </span>
        )}

        {hasChildren && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#0D7366] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0D7366]' : ''
            }`}
          />
        )}

        <span
          className={`absolute bottom-0 right-0 h-0.5 bg-[#0D7366] transition-all duration-300 rounded-full ${
            isOpen ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </a>

      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`absolute top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl shadow-[#0D7366]/10 rounded-2xl p-2 z-50 space-y-0.5 list-none max-h-[75vh] overflow-y-auto scrollbar-thin ${
                isLastItem ? 'left-0' : 'right-0'
              }`}
            >
              {item.children!.map((child) => {
                const childUrl = child.url || child.link_url || `#${child.slug}`;
                return (
                  <li key={child.id}>
                    <a
                      href={childUrl}
                      onClick={(e) => {
                        const destination = child.url || child.link_url;
                        if (destination) {
                          e.preventDefault();
                          onNavigate?.(destination);
                        }
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:text-[#0D7366] hover:bg-[#0D7366]/5 transition-all text-xs font-medium"
                    >
                      <span className="flex items-center gap-2">
                        {child.icon && (
                          <span className="material-symbols-outlined text-base text-[#0D7366]">
                            {child.icon}
                          </span>
                        )}
                        <span>{child.title}</span>
                      </span>
                      {child.badge_text && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                          {child.badge_text}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// Mobile Navbar Accordion
interface MobileNavbarAccordionItemProps {
  item: DjangoNavbarItem;
  onNavigate?: (url: string) => void;
  onCloseMenu?: () => void;
}

const MobileNavbarAccordionItem: React.FC<MobileNavbarAccordionItemProps> = ({
  item,
  onNavigate,
  onCloseMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const targetUrl = item.url || item.link_url || `#${item.slug || 'nav'}`;

  return (
    <div className="border-b border-slate-100/80 last:border-0 py-1">
      <div className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-slate-50">
        <a
          href={targetUrl}
          onClick={(e) => {
            const destination = item.url || item.link_url;
            if (destination) {
              e.preventDefault();
              onNavigate?.(destination);
              onCloseMenu?.();
            }
          }}
          className="flex items-center gap-2 text-slate-800 hover:text-[#0D7366] text-xs font-bold transition-colors flex-1"
        >
          {item.icon && (
            <span className="material-symbols-outlined text-base text-[#0D7366]">
              {item.icon}
            </span>
          )}
          <span>{item.title}</span>
          {item.badge_text && (
            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
              {item.badge_text}
            </span>
          )}
        </a>

        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-[#0D7366] transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {hasChildren && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pr-4 py-1 space-y-1 overflow-hidden"
            >
              {item.children!.map((child) => {
                const childUrl = child.url || child.link_url || `#${child.slug}`;
                return (
                  <a
                    key={child.id}
                    href={childUrl}
                    onClick={(e) => {
                      const destination = child.url || child.link_url;
                      if (destination) {
                        e.preventDefault();
                        onNavigate?.(destination);
                        onCloseMenu?.();
                      }
                    }}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-slate-600 hover:text-[#0D7366] text-xs font-medium hover:bg-emerald-50/50"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChevronLeft className="w-3 h-3 text-slate-300" />
                      <span>{child.title}</span>
                    </span>
                    {child.badge_text && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                        {child.badge_text}
                      </span>
                    )}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
