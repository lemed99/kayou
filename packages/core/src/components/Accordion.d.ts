import { JSX } from 'solid-js';
/**
 * Data structure for each accordion panel.
 */
export interface PanelData {
    /** Unique identifier for the panel */
    itemKey: string;
    /** Content displayed in the panel header */
    title: JSX.Element;
    /** Content displayed when the panel is expanded */
    content: JSX.Element;
    /** Additional CSS classes for the panel container */
    class?: string;
    /** Additional CSS classes for the panel header */
    titleClass?: string;
    /** Additional CSS classes for the panel content */
    contentClass?: string;
}
export interface AccordionProps {
    /**
     * Array of panel data to render.
     */
    panels?: PanelData[];
    /**
     * Key of the panel to highlight/scroll to.
     */
    highlightedKey?: string;
    /**
     * CSS class applied to highlighted panel header.
     * @default 'bg-teal-200 dark:bg-teal-800'
     */
    highlightedClass?: string;
    /**
     * When true, renders a simpler style without borders and backgrounds.
     * @default true
     */
    isSimple?: boolean;
    /**
     * Controlled state: map of panel keys to open state.
     */
    openPanels?: Record<string, boolean>;
    /**
     * Callback when panel open state changes (controlled mode).
     */
    onOpenChange?: (state: Record<string, boolean>) => void;
    /**
     * Additional CSS classes for the accordion container.
     */
    class?: string;
    /** @deprecated Use `highlightedKey` instead */
    searched?: string;
    /** @deprecated Use `highlightedClass` instead */
    searchedClass?: string;
    /** @deprecated Use `isSimple` instead */
    simple?: boolean;
    /** @deprecated Use `openPanels` instead */
    itemDetails?: Record<string, boolean>;
    /** @deprecated Use `onOpenChange` instead */
    setItemDetails?: (state: Record<string, boolean>) => void;
}
declare const Accordion: (props: AccordionProps) => JSX.Element;
export default Accordion;
