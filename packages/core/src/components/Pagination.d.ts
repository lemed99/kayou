import { Component } from 'solid-js';
/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
    /**
     * Total number of pages.
     */
    total: number;
    /**
     * Current page number (1-indexed).
     */
    page: number;
    /**
     * Callback fired when the page changes.
     */
    onChange: (page: number) => void;
}
/**
 * Pagination component for navigating between pages.
 */
declare const Pagination: Component<PaginationProps>;
export default Pagination;
