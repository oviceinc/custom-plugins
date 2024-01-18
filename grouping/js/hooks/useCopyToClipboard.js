const { useCallback } = React;

const useCopyToClipboard = () => {
  const copyToClipboard = useCallback(async (text) => {
    if (!navigator.clipboard) {
      console.error('Clipboard not supported on this browser');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  }, []);

  return copyToClipboard;
};