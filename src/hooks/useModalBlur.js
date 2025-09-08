import { useEffect } from 'react';

export const useModalBlur = (isOpen) => {
  useEffect(() => {
    const tabWrapper = document.querySelector('.tab-wrapper');

    if (isOpen) {
      tabWrapper?.classList.add('modal-backdrop-blur');
    } else {
      tabWrapper?.classList.remove('modal-backdrop-blur');
    }

    return () => {
      tabWrapper?.classList.remove('modal-backdrop-blur');
    };
  }, [isOpen]);
};
