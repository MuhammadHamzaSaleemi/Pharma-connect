// Uploads to the website's own /api/upload route (local disk storage), not
// admin-api — admin-api has no generic upload endpoint; services that need a
// pre-uploaded URL (e.g. scholarships' `image` field) go through here first.
export function uploadImage(file, { onProgress } = {}) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');

        xhr.upload.onprogress = (event) => {
            if (onProgress && event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            let json = null;
            try {
                json = JSON.parse(xhr.responseText);
            } catch {
                // ignore, handled by the status check below
            }
            if (xhr.status >= 200 && xhr.status < 300 && json) {
                resolve(json);
            } else {
                reject(new Error(json?.message || 'Upload failed'));
            }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
    });
}
