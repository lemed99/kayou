import { Component, JSX, createEffect, createSignal } from 'solid-js';

import Button from './Button';
import NumberInput from './NumberInput';
import Tooltip from './Tooltip';

export interface PaginationProps {
  total: number;
  page: number;
  onChange: (page: number) => void;
}

const Pagination: Component<PaginationProps> = (props) => {
  const [pageValue, setPageValue] = createSignal(1);

  createEffect(() => setPageValue(props.page));

  const setPage = (page: number) => {
    props.onChange(page);
    setPageValue(page);
  };

  const NavigationButton = (props: {
    onClick: () => void;
    disabled: boolean;
    content: JSX.Element;
    tooltip: string;
  }) => (
    <Tooltip content={props.tooltip} theme="auto">
      <Button
        color="light"
        onClick={props.onClick}
        disabled={props.disabled}
        class="w-8"
        size="xs"
      >
        {props.content}
      </Button>
    </Tooltip>
  );

  return (
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-1 italic">
        <p>Page</p>
        <NumberInput
          type="integer"
          showArrows={false}
          sizing="xs"
          value={pageValue()}
          onInput={(e) => setPageValue(parseInt(e.target.value))}
          fitContent={true}
          style={{
            'text-align': 'center',
            'font-style': 'normal',
            'min-width': '25px',
          }}
          onChange={(e) => setPage(parseInt(e.target.value))}
          min={1}
          max={props.total}
        />
        <p class="text-nowrap">sur {props.total}</p>
      </div>
      <nav class="flex items-center gap-1">
        <NavigationButton
          onClick={() => setPage(1)}
          disabled={props.page === 1}
          content="«"
          tooltip="Page 1"
        />
        <NavigationButton
          onClick={() => setPage(Math.max(1, props.page - 1))}
          disabled={props.page === 1}
          content="‹"
          tooltip={`Page ${Math.max(1, props.page - 1)}`}
        />
        <NavigationButton
          onClick={() => setPage(Math.min(props.total, props.page + 1))}
          disabled={props.page === props.total}
          content="›"
          tooltip={`Page ${Math.min(props.total, props.page + 1)}`}
        />
        <NavigationButton
          onClick={() => setPage(props.total)}
          disabled={props.page === props.total}
          content="»"
          tooltip={`Page ${props.total}`}
        />
      </nav>
    </div>
  );
};

export default Pagination;
