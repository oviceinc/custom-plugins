const { useState, useCallback, useEffect } = React;

const useToast = () => {
  const [showable, setShowable] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastType, setToastType] = useState('normal');
  const [toastPosition, setToastPosition] = useState('rightBottom');

  const Toast = useCallback(() => {
    const toastPositionClasses = {
      rightBottom: 'bottom-1 right-1',
      rightTop: 'top-1 right-1',
      leftBottom: 'bottom-1 left-1',
      leftTop: 'top-1 left-1',
    };
    const toastClasses = `fixed ${
      toastPositionClasses[toastPosition] || toastPositionClasses['rightBottom']
    } z-9 px-3 py-2 shadow bg-white rounded transition delay-100 ${
      toastType === 'normal' ? 'text-blue-600' : 'text-red-500'
    } ${showable ? 'block' : 'hidden'}`;

    return <div className={toastClasses}>{toastText}</div>;
  }, [showable, toastText, toastType, toastPosition]);

  const successToast = ({
    text,
    type = 'normal',
    position = 'rightBottom',
  }) => {
    setToastText(text);
    setToastType(type);
    setToastPosition(position);
    setShowable(true);
  };

  const errorToast = ({ text, type = 'error', position = 'rightBottom' }) => {
    setToastText(text);
    setToastType(type);
    setToastPosition(position);
    setShowable(true);
  };

  useEffect(() => {
    if (!showable) return;
    const t = setTimeout(() => {
      setToastText('');
      setShowable(false);
    }, 2000);
    return () => {
      if (!t) return;
      clearTimeout(t);
    };
  }, [showable]);
  return {
    Toast,
    successToast,
    errorToast,
  };
};
