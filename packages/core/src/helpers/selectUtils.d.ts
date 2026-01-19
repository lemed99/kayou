import { JSX } from 'solid-js';
export interface Option {
    value: string;
    label: string;
    labelWrapper?: (label: string) => JSX.Element;
}
export declare const optionsContainerClass = "scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-400 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 box-border max-h-[200px] h-full overflow-y-auto p-1";
export declare const optionClass: (option: Option, highlightedOption: Option | null) => string;
export declare const LazyLoading: (props: {
    isLazyLoading?: boolean;
}) => JSX.Element;
export declare const CTA: (props: {
    cta?: JSX.Element;
}) => JSX.Element;
export declare const OptionLabel: (props: {
    option: Option;
    selectedOption: Option | null;
}) => JSX.Element;
export declare const ClearContentButton: (props: {
    onClick: (e: Event) => void;
    class?: string;
    disabled?: boolean;
}) => JSX.Element;
export declare const ChevronDownButton: (props: {
    onFocus?: () => void;
    disabled?: boolean;
}) => JSX.Element;
