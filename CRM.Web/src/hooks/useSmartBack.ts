import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useSmartBack = (options?: { fallbackPath?: string }) => {
  const navigate = useNavigate();
  const { fallbackPath = '/' } = options || {};

  return useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  }, [navigate, fallbackPath]);
};