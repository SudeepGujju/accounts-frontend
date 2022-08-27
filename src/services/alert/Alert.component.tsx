import React, { useEffect, useState } from "react";

import { Dialog } from "primereact/dialog";
import { AlertConfig, ALERT_CUSTOM_EVENT, ALERT_TYPE } from "./alert.service";
import { Button } from "primereact/button";

function AlertComponent() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [config, setConfig] = useState<AlertConfig>();

  const onHide = () => {
    setIsVisible(false);
    setConfig(undefined);
    config && config.onClose && config.onClose();
  };

  useEffect(() => {
    const listener = (event: any) => {
      setConfig(event.detail);
      setIsVisible(true);
    };

    window.addEventListener(ALERT_CUSTOM_EVENT, listener);

    return () => {
      window.removeEventListener(ALERT_CUSTOM_EVENT, listener);
    };
  }, []);

  let messageIcon = "pi pi-check text-green-600";

  switch (config?.type) {
    case ALERT_TYPE.WARNING:
      messageIcon = "pi pi-exclamation-triangle text-amber-500";
      break;
    case ALERT_TYPE.ERROR:
      messageIcon = "pi pi-exclamation-circle text-red-600";
      break;
  }

  let footer = (
    <div className="text-right">
      <Button onClick={onHide} autoFocus>
        OK
      </Button>
    </div>
  );

  return config ? (
    <Dialog
      visible={isVisible}
      header={config.title}
      footer={footer}
      onHide={onHide}
      style={{ minWidth: "30vw" }}
      contentClassName="!px-6 !py-0"
    >
      <div>
        <span
          className={`font-bold align-middle !text-3xl ${messageIcon}`}
        ></span>
        <span className="ml-2 align-middle">{config.message}</span>
      </div>
    </Dialog>
  ) : (
    <></>
  );
}

export default AlertComponent;
