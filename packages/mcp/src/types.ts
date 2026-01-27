// Types for kayou MCP data structures

export interface PropDefinition {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
  deprecated?: boolean;
}

export interface DependencyDefinition {
  name: string;
  url: string;
  usage: string;
}

export interface KeyConceptDefinition {
  term: string;
  explanation: string;
}

export interface ExampleDefinition {
  title: string;
  description: string;
  code?: string;
}

export interface SubComponentDefinition {
  name: string;
  description: string;
  props: PropDefinition[];
}

export interface ComponentData {
  name: string;
  description: string;
  package: '@kayou/ui';
  importPath: string;
  props: PropDefinition[];
  subComponents?: SubComponentDefinition[];
  dependencies?: DependencyDefinition[];
  keyConcepts?: KeyConceptDefinition[];
  examples: ExampleDefinition[];
  usage: string;
  relatedHooks?: string[];
  relatedContexts?: string[];
}

export interface HookParameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface HookReturn {
  name: string;
  type: string;
  description: string;
}

export interface HookData {
  name: string;
  description: string;
  package: '@kayou/hooks';
  importPath: string;
  parameters: HookParameter[];
  returnType?: string;
  returns: HookReturn[];
  examples: ExampleDefinition[];
  usage: string;
}

export interface IconData {
  name: string;
  exportName: string;
  fileName: string;
  category?: string;
}

export interface KayouData {
  version: string;
  generatedAt: string;
  components: ComponentData[];
  hooks: HookData[];
  icons: IconData[];
}
