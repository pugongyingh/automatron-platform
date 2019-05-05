export interface ScriptExecutionInput {
  /** User-configured bot module */
  program?: string
  /** State object */
  state?: string
  /** User-inputted code */
  code: string
}

export interface ScriptExecutionResult {
  /** String representation of the last expression */
  output?: string
  /** Log messages emitted by `say()` */
  logs: string[]
  /** Error messages */
  error?: string
  /** Next state */
  nextState?: string
}
