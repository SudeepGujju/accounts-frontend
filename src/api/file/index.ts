import { api } from '../../services';

export function uploadFile(url: string, file: File, params: object = {}) {

    const formData = new FormData();
    formData.append('file', file, file.name);

    if (params) {

        for (var [k, v] of Object.entries(params)) {

            formData.append(k, v);

        }

    }

    return api.post(url, formData);
}

export function downloadSampleFile(url: string) {

    return api.get(url, { responseType: 'blob' });
}