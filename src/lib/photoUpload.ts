import * as ImagePicker from 'expo-image-picker';

/**
 * Upload rules (backend): JPEG / PNG / WebP only — HEIC is rejected — at most
 * 15 MB per photo (10 MB in chat). These helpers keep every photo the app
 * sends inside those rules.
 */

/**
 * Shared picker options for any photo that gets uploaded.
 * - `Compatible` makes iOS hand back a JPEG instead of the iPhone's HEIC.
 * - quality 0.6 keeps a full-resolution phone photo around 1–3 MB, so it
 *   uploads fast on mobile data and stays far below the 15 MB limit.
 */
export const UPLOAD_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 0.6,
    preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
};

const IMAGE_MIME: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
};

const extOf = (value?: string | null): string =>
    (value ?? '').split('?')[0].split('#')[0].split('/').pop()?.split('.').pop()?.toLowerCase() ?? '';

/**
 * The `{ uri, name, type }` React Native sends as a multipart file.
 *
 * For images the name and type follow the actual file on disk (its uri), not
 * the picker's `fileName` / `mimeType`: after iOS converts a HEIC photo to
 * JPEG the original "IMG_0001.HEIC" name can survive, and the server would
 * reject a JPEG labelled as HEIC. Non-image files (chat documents) keep the
 * type they were picked with.
 */
export const uploadFile = (
    uri: string,
    name?: string | null,
    type?: string | null,
    fallbackName = 'photo',
): Blob => {
    const baseName = (name ?? uri.split('/').pop() ?? fallbackName).replace(/\.[^.]+$/, '') || fallbackName;

    if (type && !type.startsWith('image/')) {
        return { uri, name: name ?? `${baseName}.${extOf(uri) || 'bin'}`, type } as unknown as Blob;
    }

    const fileExt = extOf(uri);
    const ext = IMAGE_MIME[fileExt] ? fileExt : 'jpg';
    return {
        uri,
        name: `${baseName}.${ext === 'jpeg' ? 'jpg' : ext}`,
        type: IMAGE_MIME[ext],
    } as unknown as Blob;
};
