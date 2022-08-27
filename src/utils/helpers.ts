import { MutableRefObject } from 'react';

export function customFocusField(vFldRef: MutableRefObject<any>) {

    if (vFldRef) {

        if (vFldRef.current.focusInput) { setTimeout(() => { vFldRef.current.focusInput.focus(); }, 100); return; }

        if (vFldRef.current.inputRef) { setTimeout(() => { vFldRef.current.inputRef.current.focus(); }, 100); return; }
    }

}