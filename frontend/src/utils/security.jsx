export const initSecurityListeners = (showWarning) => {
  // Prevent Tab Switching
  const handleVisibility = () => {
    if (document.hidden) {
      showWarning("Tab switching detected! This is not allowed.", "tab_switch");
    }
  };
  const handleBlur = () => {
    showWarning("Window focus lost! This is not allowed.", "window_blur");
  };
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("blur", handleBlur);

  // Prevent Copy, Paste, Cut & Right-Click
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && e.key === "c") ||
      (e.ctrlKey && e.key === "v") ||
      (e.ctrlKey && e.key === "x")
    ) {
      e.preventDefault();
      const action = e.key === "c" ? "copy" : e.key === "v" ? "paste" : "cut";
      showWarning(
        `${action.charAt(0).toUpperCase() + action.slice(1)} is not allowed!`,
        action
      );
    }
  };
  const handleCopy = (e) => {
    e.preventDefault();
    showWarning("Copying is not allowed!", "copy");
  };
  const handlePaste = (e) => {
    e.preventDefault();
    showWarning("Pasting is not allowed!", "paste");
  };
  const handleCut = (e) => {
    e.preventDefault();
    showWarning("Cutting is not allowed!", "cut");
  };
  const handleContextMenu = (e) => {
    e.preventDefault();
    showWarning("Right-click is not allowed!", "right_click");
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("copy", handleCopy);
  document.addEventListener("paste", handlePaste);
  document.addEventListener("cut", handleCut);
  document.addEventListener("contextmenu", handleContextMenu);

  // Prevent leaving/refreshing page
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = "";
    showWarning("Leaving the page is not allowed!", "leave_page");
    return "";
  };
  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("blur", handleBlur);
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("copy", handleCopy);
    document.removeEventListener("paste", handlePaste);
    document.removeEventListener("cut", handleCut);
    document.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
};
