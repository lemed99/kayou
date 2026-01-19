import { Accessor, JSX } from 'solid-js';
import { TextInputProps } from '../components/TextInput';
import { type Option } from '../helpers/selectUtils';
interface MergedSelectProps extends Omit<TextInputProps, 'onSelect'> {
    options: Option[];
    value?: string;
    onSelect?: (option?: Option) => void;
    onMultiSelect?: (options?: Option[]) => void;
    values?: string[];
    clearValues?: boolean;
    withSearch?: boolean;
    searchPlaceholder?: string;
    clearValue?: boolean;
    autoFillSearchKey?: boolean;
    idValue?: string;
    optionRowHeight?: number;
    noSearchResultPlaceholder?: string;
    cta?: JSX.Element;
    isLazyLoading?: boolean;
    onLazyLoad?: (scrollProgress: number) => void;
}
declare const useSelect: <T extends MergedSelectProps>(props: T, type: "select" | "selectWithSearch" | "multiSelect") => {
    searchKey: Accessor<string>;
    setSearchKey: import("solid-js").Setter<string>;
    selectedOption: Accessor<Option | null>;
    setSelectedOption: import("solid-js").Setter<Option | null>;
    selectedOptions: Accessor<Option[]>;
    setSelectedOptions: import("solid-js").Setter<Option[]>;
    highlightedOption: Accessor<Option | null>;
    setHighlightedOption: import("solid-js").Setter<Option | null>;
    filteredOptions: Accessor<Option[]>;
    setFilteredOptions: import("solid-js").Setter<Option[]>;
    isOpen: Accessor<boolean>;
    listboxId: string;
    searchInputId: string;
    handleKeyDown: (e: KeyboardEvent & {
        currentTarget: HTMLElement;
        target: Element;
    }, copy?: boolean) => void;
    handleOptionClick: (option: Option) => void;
    handleSearchChange: (e: InputEvent & {
        currentTarget: HTMLInputElement;
        target: HTMLInputElement;
    }) => void;
    handleInputClick: () => void;
    searchRef: Accessor<HTMLInputElement | undefined>;
    Layout: (layoutProps: {
        inputComponent: JSX.Element;
        optionsComponent: (option: Option, index: Accessor<number>) => JSX.Element;
        preOptionsComponent?: JSX.Element;
    }) => JSX.Element;
    setSearchRef: import("solid-js").Setter<HTMLInputElement | undefined>;
};
export default useSelect;
