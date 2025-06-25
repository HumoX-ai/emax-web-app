import { useEffect } from "react";

interface MainButtonProps {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const MainButton = ({ text, loading, disabled, onClick }: MainButtonProps) => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.MainButton) return;
    const mainButton = tg.MainButton;
    mainButton.setText(text);
    mainButton.setParams({
      color: tg.themeParams?.button_color,
      text_color: tg.themeParams?.button_text_color,
      has_shine_effect: true,
      is_active: !disabled,
      is_visible: true,
    });
    mainButton.show();
    if (loading) {
      mainButton.showProgress();
      mainButton.disable();
    } else {
      mainButton.hideProgress();
      mainButton.enable();
    }
    mainButton.onClick(onClick);
    return () => {
      mainButton.offClick(onClick);
      mainButton.hide();
      mainButton.hideProgress();
    };
  }, [text, loading, disabled, onClick]);
  return null;
};

export default MainButton;
