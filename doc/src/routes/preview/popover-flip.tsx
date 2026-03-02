import { Button, Popover } from '@kayou/ui';

export default function PopoverFlipPreview() {
  return (
    <div class="flex min-h-screen items-center">
      {/* Push the trigger to the right side of the screen */}

      <div class="p-4" data-testid="trigger-right-area">
        <Popover
          content={
            <div class="p-4" style={{ width: '580px', height: '200px' }}>
              <p class="text-sm font-medium">Wide popover</p>
              <p class="text-sm text-neutral-500">
                This popover is wide enough to trigger horizontal flip logic on
                a mobile screen.
              </p>
            </div>
          }
          position="bottom-start"
          aria-label="Right popover"
        >
          <Button data-testid="trigger-right-btn">Open right</Button>
        </Popover>
      </div>

      <div style={{ width: '40px' }} />
    </div>
  );
}
