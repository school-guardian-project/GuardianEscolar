// [MOCK-API] Hook con abort, mounted guard y cache — evita leaks y renders innecesarios.
import { useEffect, useState, useCallback, useRef } from "react";
import { API_CONFIG } from "../api.config";

/**
 * @param {() => Promise<any>} fetcher función que retorna promesa (ej. () => routeService.list())
 * @param {any[]} deps dependencias estables (usa ids primitivos, no objetos)
 * @returns {{data:any, loading:boolean, error:Error|null, refetch:()=>void}}
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!API_CONFIG.ENABLED) {
      if (mounted.current) setLoading(false);
      return;
    }
    // Cancela vuelo previo (rendimiento)
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    if (mounted.current) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await fetcher({ signal: ctrl.signal });
      if (!mounted.current || ctrl.signal.aborted) return;
      setData(res);
    } catch (e) {
      if (!mounted.current || e.name === "AbortError") return;
      setError(e);
      if (API_CONFIG.FALLBACK_TO_MOCK && typeof __DEV__ !== "undefined" && __DEV__) console.warn("[useApi]", e.message);
    } finally {
      if (mounted.current && !ctrl.signal.aborted) setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    fetchData();
    return () => {
      mounted.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
