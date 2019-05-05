export interface ScriptExecutionInput {
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
}
