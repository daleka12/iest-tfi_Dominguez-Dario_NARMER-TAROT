// Declaraciones de tipos globales y de módulos CDN/ESM para evitar falsos errores en el IDE sin node_modules local

declare var __dirname: string;
declare var process: {
  env: Record<string, string | undefined>;
};

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  type Element = any;
}

declare module 'react' {
  namespace React {
    type FC<P = {}> = (props: P & { children?: any; key?: any }) => any;
    type ReactNode = any;
    type CSSProperties = Record<string, any>;
    type MouseEvent<T = Element> = any;
    type TouchEvent<T = Element> = any;
    type ChangeEvent<T = Element> = any;
    type FormEvent<T = Element> = any;
    type KeyboardEvent<T = Element> = any;
    type SVGProps<T = SVGSVGElement> = Record<string, any>;
    type HTMLAttributes<T = HTMLElement> = Record<string, any>;
  }
  export function useState<T = any>(initialState?: T | (() => T)): [T, (value: any) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T = any>(initialValue?: T): { current: T };
  export function useMemo<T = any>(factory: () => T, deps: readonly any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useContext<T = any>(context: any): T;
  export function createContext<T = any>(defaultValue: T): any;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const Fragment: any;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    useContext: typeof useContext;
    createContext: typeof createContext;
    createElement: typeof createElement;
    Fragment: any;
    [key: string]: any;
  };
  export default React;
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
  }
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare module 'react/jsx-dev-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    type Element = any;
  }
  export const Fragment: any;
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: boolean, source?: any, self?: any): any;
}

declare module 'react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: any): void;
    unmount(): void;
  };
}

declare module 'lucide-react' {
  const icons: Record<string, any>;
  export const Sparkles: any;
  export const Compass: any;
  export const Moon: any;
  export const Sun: any;
  export const Star: any;
  export const Eye: any;
  export const ArrowRight: any;
  export const ArrowLeft: any;
  export const ArrowUpRight: any;
  export const ArrowDownRight: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const X: any;
  export const Check: any;
  export const CheckCircle2: any;
  export const Clock: any;
  export const Calendar: any;
  export const Video: any;
  export const FileText: any;
  export const BookOpen: any;
  export const Volume2: any;
  export const VolumeX: any;
  export const Music: any;
  export const Wind: any;
  export const Sliders: any;
  export const Play: any;
  export const Pause: any;
  export const RotateCcw: any;
  export const RefreshCw: any;
  export const Send: any;
  export const MessageCircle: any;
  export const Mail: any;
  export const MapPin: any;
  export const Shield: any;
  export const ShieldCheck: any;
  export const Heart: any;
  export const HeartHandshake: any;
  export const Brain: any;
  export const HelpCircle: any;
  export const Feather: any;
  export const Layers: any;
  export const Dna: any;
  export const Bell: any;
  export const Quote: any;
  export const User: any;
  export const Users: any;
  export const Info: any;
  export const ExternalLink: any;
  export const Menu: any;
  export default icons;
}

declare module 'motion/react' {
  export const motion: Record<string, any>;
  export const AnimatePresence: any;
  export function useScroll(options?: any): any;
  export function useTransform(...args: any[]): any;
  export function useSpring(...args: any[]): any;
  export function useMotionValue(initial: any): any;
  export function useInView(ref: any, options?: any): boolean;
}

declare module 'framer-motion' {
  export const motion: Record<string, any>;
  export const AnimatePresence: any;
  export function useScroll(options?: any): any;
  export function useTransform(...args: any[]): any;
  export function useSpring(...args: any[]): any;
  export function useMotionValue(initial: any): any;
  export function useInView(ref: any, options?: any): boolean;
}

declare module 'vite' {
  export function defineConfig(config: any): any;
  export function loadEnv(mode: string, envDir: string, prefixes?: string | string[]): Record<string, string>;
}

declare module '@vitejs/plugin-react' {
  const react: any;
  export default react;
}

declare module '@tailwindcss/vite' {
  const tailwindcss: any;
  export default tailwindcss;
}

declare module 'path' {
  const path: {
    resolve(...paths: string[]): string;
    join(...paths: string[]): string;
    dirname(p: string): string;
    basename(p: string, ext?: string): string;
  };
  export default path;
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}
