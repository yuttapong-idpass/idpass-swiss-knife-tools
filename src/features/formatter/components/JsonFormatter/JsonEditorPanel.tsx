import React, { useEffect, useImperativeHandle, useRef } from "react";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";
import {
  createJSONEditor,
  isTextContent,
  Mode,
  type Content,
  type MenuItem,
} from "vanilla-jsoneditor";
import { useTheme } from "@/providers/ThemeProvider";

export type JsonEditorHandle = {
  getText: () => string;
  setText: (text: string) => void;
  focus: () => void;
};

type Props = {
  initialText?: string;
  onContentChange?: (text: string, error: string | null) => void;
  /**
   * Receives the editor's own menu items on every render. They carry vanilla
   * jsoneditor's real handlers and live `disabled` state, so the surrounding UI
   * can render them as its own buttons instead of reimplementing the actions.
   */
  onMenuItemsChange?: (items: MenuItem[]) => void;
};

const contentToText = (content: Content): string =>
  isTextContent(content) ? content.text : JSON.stringify(content.json, null, 2);

const JsonEditorPanel = ({
  ref,
  initialText = "",
  onContentChange,
  onMenuItemsChange,
}: Props & { ref?: React.Ref<JsonEditorHandle> }) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const jsonEditorRef = useRef<any>(null);
  const onContentChangeRef = useRef(onContentChange);
  const onMenuItemsChangeRef = useRef(onMenuItemsChange);
  const { theme } = useTheme();

  const isDarkTheme =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  onContentChangeRef.current = onContentChange;
  onMenuItemsChangeRef.current = onMenuItemsChange;

  useEffect(() => {
    if (!refContainer.current || jsonEditorRef.current) return;

    jsonEditorRef.current = createJSONEditor({
      target: refContainer.current,
      props: {
        mode: Mode.text,
        content: { text: initialText },
        // The menu bar stays enabled so `onRenderMenu` keeps firing, but it is
        // hidden with CSS: its buttons are re-rendered in the tool panel.
        mainMenuBar: true,
        navigationBar: true,
        statusBar: true,
        onChange: (updatedContent: Content, _previous: Content, status: any) => {
          const parseError = status?.contentErrors?.parseError;
          onContentChangeRef.current?.(
            contentToText(updatedContent),
            parseError ? parseError.message : null,
          );
        },
        onRenderMenu: (items: MenuItem[]) => {
          onMenuItemsChangeRef.current?.(items);
          return [];
        },
      },
    });

    return () => {
      jsonEditorRef.current?.destroy();
      jsonEditorRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getText: () => {
      const content = jsonEditorRef.current?.get();
      return content ? contentToText(content) : "";
    },
    setText: (text: string) => {
      const content = { text };
      // `set` replaces the content and resets undo history, but the editor also
      // keeps syncing CodeMirror from its `content` prop. Leaving that prop on
      // the value passed at creation lets a later re-render restore the old
      // text, so update it too and keep the two in agreement.
      jsonEditorRef.current?.set(content);
      jsonEditorRef.current?.updateProps({ content });
      onContentChangeRef.current?.(text, null);
    },
    focus: () => jsonEditorRef.current?.focus(),
  }));

  return (
    <div
      className={`${isDarkTheme ? "jse-theme-dark" : "jse-theme-light"} json-editor-surface flex-1 min-h-0 overflow-hidden`}
      ref={refContainer}
    />
  );
};

export default JsonEditorPanel;
