import { createStore } from 'solid-js/store';

import Accordion from '../../components/Accordion';
import DocPage from '../../doc/components/DocPage';

export default function AccordionPage() {
  return (
    <DocPage
      title="Accordion Component"
      description="The Accordion component is a vertically stacked set of interactive headings used to toggle the display of content sections. It supports both controlled and uncontrolled modes, and can be used with either a panels array or children components."
      props={[
        {
          name: 'panels',
          type: 'PanelData[]',
          default: '[]',
          description:
            'Array of panel data objects containing title, content, and other properties',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: 'undefined',
          description:
            'Alternative to panels prop, allows passing Accordion.Panel components as children',
        },
        {
          name: 'searched',
          type: 'string',
          default: 'undefined',
          description: 'Key of the panel to highlight and scroll into view',
        },
        {
          name: 'simple',
          type: 'boolean',
          default: 'true',
          description:
            'Whether to use a simpler styling without rounded corners and background colors',
        },
        {
          name: 'itemDetails',
          type: 'Record<string, boolean>',
          default: 'undefined',
          description:
            'Controlled mode: State object mapping panel keys to their open/closed state',
        },
        {
          name: 'setItemDetails',
          type: '(state: Record<string, boolean>) => void',
          default: 'undefined',
          description: 'Controlled mode: Function to update the state of panels',
        },
      ]}
      examples={[
        {
          title: 'Basic Usage',
          description: 'A simple accordion with predefined panels',
          code: `<Accordion
  panels={[
    {
      itemKey: "intro",
      title: <h3 class="font-medium">Introduction</h3>,
      content: <p>This is an introduction to our product.</p>
    },
    {
      itemKey: "details",
      title: <h3 class="font-medium">Technical Details</h3>,
      content: <p>Here are the technical specifications.</p>
    }
  ]}
/>`,
          component: () => (
            <Accordion
              panels={[
                {
                  itemKey: 'intro',
                  title: <h3 class="font-medium">Introduction</h3>,
                  content: <p>This is an introduction to our product.</p>,
                },
                {
                  itemKey: 'details',
                  title: <h3 class="font-medium">Technical Details</h3>,
                  content: <p>Here are the technical specifications.</p>,
                },
              ]}
            />
          ),
        },
        {
          title: 'Controlled Mode',
          description: 'An accordion with controlled state management',
          code: `const [openPanels, setOpenPanels] = createStore({
  intro: true,
  details: false
});

<Accordion
  panels={[
    {
      itemKey: "intro",
      title: <h3 class="font-medium">Introduction</h3>,
      content: <p>This panel starts open.</p>
    },
    {
      itemKey: "details",
      title: <h3 class="font-medium">Details</h3>,
      content: <p>This panel starts closed.</p>
    }
  ]}
  itemDetails={openPanels}
  setItemDetails={setOpenPanels}
/>`,
          component: () => {
            const [openPanels, setOpenPanels] = createStore({
              intro: true,
              details: false,
            });

            return (
              <Accordion
                panels={[
                  {
                    itemKey: 'intro',
                    title: <h3 class="font-medium">Introduction</h3>,
                    content: <p>This panel starts open.</p>,
                  },
                  {
                    itemKey: 'details',
                    title: <h3 class="font-medium">Details</h3>,
                    content: <p>This panel starts closed.</p>,
                  },
                ]}
                itemDetails={openPanels}
                setItemDetails={setOpenPanels}
              />
            );
          },
        },
        {
          title: 'With Search Highlight',
          description: 'An accordion that highlights and scrolls to a specific panel',
          code: `<Accordion
  panels={[
    {
      itemKey: "intro",
      title: <h3 class="font-medium">Introduction</h3>,
      content: <p>This is the introduction.</p>
    },
    {
      itemKey: "details",
      title: <h3 class="font-medium">Details</h3>,
      content: <p>This is the details section.</p>
    }
  ]}
  searched="details"
/>`,
          component: () => (
            <Accordion
              panels={[
                {
                  itemKey: 'intro',
                  title: <h3 class="font-medium">Introduction</h3>,
                  content: <p>This is the introduction.</p>,
                },
                {
                  itemKey: 'details',
                  title: <h3 class="font-medium">Details</h3>,
                  content: <p>This is the details section.</p>,
                },
              ]}
              searched="details"
            />
          ),
        },
      ]}
      usage={`import Accordion from "path/to/components/Accordion";
import { createStore } from "solid-js/store";

// Basic usage
<Accordion
  panels={[
    {
      itemKey: "section1",
      title: <h3>Section 1</h3>,
      content: <p>Content for section 1</p>
    }
  ]}
/>

// Controlled mode
const [openPanels, setOpenPanels] = createStore({
  section1: true,
  section2: false
});

<Accordion
  panels={[
    {
      itemKey: "section1",
      title: <h3>Section 1</h3>,
      content: <p>Content for section 1</p>
    }
  ]}
  itemDetails={openPanels}
  setItemDetails={setOpenPanels}
/>`}
    />
  );
}
