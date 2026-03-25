/**
 * Barrel re-export for all Lucide React icons used in the project.
 *
 * Always import icons from this file rather than directly from `lucide-react`.
 * This keeps imports consistent across the codebase and makes it easy to audit
 * which icons are in use at a glance.
 *
 * To add a new icon: find its name on {@link https://lucide.dev | lucide.dev},
 * add it to the export list below, then import it from `@/components/icons`.
 *
 * Two icons in the project intentionally do NOT come from Lucide:
 * - WhatsApp logo (`navbar.tsx`) — brand icon with a specific gradient
 * - Decorative quote mark (`review-card-v2.tsx`) — custom viewBox shape
 *
 * @module
 */
export {
  ArrowRight,
  BadgePoundSterling,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Eye,
  Handshake,
  House,
  Mail,
  Menu,
  Navigation,
  Phone,
  Route,
  ShieldCheck,
  Star,
  TriangleAlert,
  Truck,
  UserStar,
  Van,
  X,
  Zap,
} from 'lucide-react';
