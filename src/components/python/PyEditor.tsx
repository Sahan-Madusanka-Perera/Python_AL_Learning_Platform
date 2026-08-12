"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror, { type ReactCodeMirrorRef, EditorView, Decoration } from "@uiw/react-codemirror";
import { StateField, StateEffect, type Extension } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { cn } from "@/lib/utils";

/* ============================================================================
 * Code editor.
 *
 * CodeMirror rather than Monaco: it is a fraction of the size, and — the part
 * that actually matters here — it behaves properly with a mobile soft keyboard.
 * A student on a phone is the primary user of this app.
 * ==========================================================================*/

const highlightLine = StateEffect.define<number | null>();

const traceHighlight = StateField.define({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(highlightLine)) {
        if (e.value === null) return Decoration.none;
        const lineNo = Math.max(1, Math.min(e.value, tr.state.doc.lines));
        const line = tr.state.doc.line(lineNo);
        return Decoration.set([
          Decoration.line({ class: "cm-trace-active" }).range(line.from),
        ]);
      }
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const baseTheme = EditorView.theme({
  "&": { fontSize: "13.5px" },
  ".cm-content": { padding: "4px 0" },
  ".cm-line": { padding: "0 12px" },
});

export interface PyEditorProps {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  lang?: "python" | "sql";
  minHeight?: string;
  maxHeight?: string;
  className?: string;
  /** 1-based line to highlight (used by the step-through tracer). */
  activeLine?: number | null;
  placeholder?: string;
  /** Exposes the CodeMirror instance so the mobile key bar can insert text. */
  editorRef?: React.RefObject<ReactCodeMirrorRef | null>;
}

export function PyEditor({
  value,
  onChange,
  readOnly,
  lang = "python",
  minHeight = "120px",
  maxHeight,
  className,
  activeLine = null,
  placeholder,
  editorRef,
}: PyEditorProps) {
  const ownRef = useRef<ReactCodeMirrorRef>(null);
  const ref = editorRef ?? ownRef;
  const [isDark, setIsDark] = useState(false);

  // Follow the app theme without re-mounting the editor.
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setIsDark(el.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    ref.current?.view?.dispatch({ effects: highlightLine.of(activeLine) });
  }, [activeLine, ref]);

  const extensions = useMemo<Extension[]>(
    () => [lang === "sql" ? sql() : python(), traceHighlight, baseTheme, EditorView.lineWrapping],
    [lang],
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-surface",
        readOnly && "bg-sunken",
        className,
      )}
    >
      <CodeMirror
        ref={ref}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        theme={isDark ? "dark" : "light"}
        extensions={extensions}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: !readOnly,
          bracketMatching: true,
          closeBrackets: !readOnly,
          indentOnInput: true,
          tabSize: 4,
          searchKeymap: false,
        }}
        style={{ minHeight, maxHeight, overflow: "auto" }}
        className="scrollbar-slim"
      />
    </div>
  );
}

/* ── mobile key bar ──────────────────────────────────────────────────────── */

const KEYS: { label: string; insert: string; wide?: boolean }[] = [
  { label: "Tab", insert: "    ", wide: true },
  { label: ":", insert: ":" },
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
  { label: "[", insert: "[" },
  { label: "]", insert: "]" },
  { label: '"', insert: '"' },
  { label: "_", insert: "_" },
  { label: "=", insert: "=" },
  { label: "==", insert: "==" },
  { label: "<", insert: "<" },
  { label: ">", insert: ">" },
  { label: "#", insert: "#" },
  { label: "%", insert: "%" },
  { label: "+", insert: "+" },
  { label: "-", insert: "-" },
  { label: "*", insert: "*" },
  { label: "/", insert: "/" },
];

/**
 * Symbol bar for phones.
 *
 * `:` `_` `(` and a four-space indent are buried two taps deep on an Android
 * keyboard, and Python needs all of them constantly. Without this, writing code
 * on a phone is miserable enough that students give up.
 */
export function MobileKeyBar({ onInsert }: { onInsert: (text: string) => void }) {
  return (
    <div className="scrollbar-none flex gap-1 overflow-x-auto border-t border-line bg-sunken px-2 py-1.5 lg:hidden">
      {KEYS.map((k) => (
        <button
          key={k.label}
          type="button"
          // Keep the soft keyboard open when the student taps a symbol.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(k.insert)}
          className={cn(
            "shrink-0 rounded-md border border-line bg-surface px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[13px] font-medium text-ink active:bg-hover",
            k.wide && "px-3",
          )}
        >
          {k.label}
        </button>
      ))}
    </div>
  );
}

/** Insert text at the cursor of a CodeMirror instance. */
export function insertAtCursor(view: EditorView | undefined, text: string) {
  if (!view) return;
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
    scrollIntoView: true,
  });
  view.focus();
}
