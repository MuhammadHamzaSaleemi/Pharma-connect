import { requestFormData } from "../http/httpClient";

// Uploads to admin-api (signed-in users only) and returns { url }. Services that
// need a pre-uploaded URL (e.g. scholarships' `image`, the profile avatar) go through here first.
export function uploadImage(token, file) {
    const formData = new FormData();
    formData.append('file', file);
    return requestFormData('/uploads/image', { method: 'POST', token, body: formData });
}
