/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import AdminGallery from './pages/AdminGallery';
import AdminMessages from './pages/AdminMessages';
import AdminServices from './pages/AdminServices';
import AdminSettings from './pages/AdminSettings';
import AdminTestimonials from './pages/AdminTestimonials';
import Contact from './pages/Contact';
import Galeria from './pages/Galeria';
import Home from './pages/Home';
import ONas from './pages/ONas';
import Oferta from './pages/Oferta';
import Realizacje from './pages/Realizacje';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "AdminEvents": AdminEvents,
    "AdminGallery": AdminGallery,
    "AdminMessages": AdminMessages,
    "AdminServices": AdminServices,
    "AdminSettings": AdminSettings,
    "AdminTestimonials": AdminTestimonials,
    "Contact": Contact,
    "Galeria": Galeria,
    "Home": Home,
    "ONas": ONas,
    "Oferta": Oferta,
    "Realizacje": Realizacje,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};