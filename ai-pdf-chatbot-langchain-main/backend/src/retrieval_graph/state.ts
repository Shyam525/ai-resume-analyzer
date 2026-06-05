import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import { reduceDocs } from '../shared/state.js';
import { Document } from '@langchain/core/documents';
/**
 * Represents the state of the retrieval graph / agent.
 */
export const AgentStateAnnotation = Annotation.Root({
  query: Annotation<string>(),
  route: Annotation<string>(),
  ...MessagesAnnotation.spec,

  /**
   * Populated by the retriever. This is a list of documents that the agent can reference.
   * Supports various input formats that are normalized to Document[] via reduceDocs.
   */
  documents: Annotation<
    Document[],
    Document[] | { [key: string]: any }[] | string[] | string | 'delete'
  >({
    default: () => [],
    reducer: reduceDocs,
  }),

  // Additional attributes can be added here as needed
});
