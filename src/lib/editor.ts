
export const monacoOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: "on" as const,
  folding: false,
  renderLineHighlight: "none" as const,
  fontSize: 14,
  padding: { top: 8, bottom: 8 },
  overviewRulerLanes: 0,
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
};

export const monacoReadOnlyOptions = {
  ...monacoOptions,
  readOnly: true,
};
