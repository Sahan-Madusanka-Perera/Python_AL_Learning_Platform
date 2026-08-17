"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getRuntime,
  type PyError,
  type RuntimeStatus,
  type Stream,
  type VirtualFile,
} from "@/lib/python/runtime";
import { explainError, type FriendlyError } from "@/lib/python/errors";
import type { OutputChunk } from "./Terminal";

/**
 * React binding for the Python runtime.
 *
 * Owns the terminal transcript, the "waiting for input" state and the friendly
 * error, so a component only has to call `run(code)` and render the result.
 */
export function usePython() {
  const [status, setStatus] = useState<RuntimeStatus>({ state: "idle" });
  const [chunks, setChunks] = useState<OutputChunk[]>([]);
  const [running, setRunning] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [error, setError] = useState<FriendlyError | null>(null);
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [ms, setMs] = useState<number | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const rt = getRuntime();
    const unsub = rt.subscribe(setStatus);
    return () => {
      mounted.current = false;
      unsub();
    };
  }, []);

  /** Boot Python eagerly: usually called when a runnable block scrolls in. */
  const warmUp = useCallback(() => {
    void getRuntime().start();
  }, []);

  const clear = useCallback(() => {
    setChunks([]);
    setError(null);
    setMs(null);
  }, []);

  const run = useCallback(
    async (
      code: string,
      opts: {
        stdin?: string[];
        files?: { path: string; content: string }[];
        resetFs?: boolean;
        wantFiles?: boolean;
        timeoutMs?: number;
      } = {},
    ) => {
      const rt = getRuntime();
      setChunks([]);
      setError(null);
      setMs(null);
      setRunning(true);

      const result = await rt.run(code, {
        ...opts,
        timeoutMs: opts.timeoutMs ?? 20_000,
        onOutput: (text: string, stream: Stream) => {
          if (!mounted.current) return;
          setChunks((cur) => {
            const last = cur[cur.length - 1];
            // Coalesce consecutive chunks of the same stream so React renders
            // one span per burst rather than one per postMessage.
            if (last && last.stream === stream) {
              return [...cur.slice(0, -1), { stream, text: last.text + text }];
            }
            return [...cur, { stream, text }];
          });
          setAwaitingInput(false);
        },
        onInputRequest: () => {
          if (mounted.current) setAwaitingInput(true);
        },
      });

      if (!mounted.current) return result;

      setRunning(false);
      setAwaitingInput(false);
      setMs(result.ms ?? null);
      if (result.error) setError(explainError(result.error as PyError));
      if (result.files) setFiles(result.files);
      return result;
    },
    [],
  );

  const sendInput = useCallback((text: string) => {
    setAwaitingInput(false);
    getRuntime().sendInput(text);
  }, []);

  const stop = useCallback(() => {
    getRuntime().interrupt();
    setAwaitingInput(false);
  }, []);

  const refreshFiles = useCallback(async () => {
    const list = await getRuntime().listFiles();
    if (mounted.current) setFiles(list);
    return list;
  }, []);

  return {
    status,
    ready: status.state === "ready",
    booting: status.state === "booting",
    chunks,
    running,
    awaitingInput,
    error,
    files,
    ms,
    run,
    stop,
    clear,
    sendInput,
    warmUp,
    refreshFiles,
    setFiles,
  };
}
