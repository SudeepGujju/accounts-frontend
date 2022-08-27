export enum ALERT_TYPE {
    SUCCESS = 0,
    WARNING = 1,
    ERROR = 2,
}

export type AlertConfig = {
    title: string;
    message: string;
    type: ALERT_TYPE;
    onClose?: () => void;
};

export const ALERT_CUSTOM_EVENT = 'ALERT_CUSTOM_EVENT';

export function showAlert(config: AlertConfig) {

    window.dispatchEvent(new CustomEvent(ALERT_CUSTOM_EVENT, { detail: config }))

}