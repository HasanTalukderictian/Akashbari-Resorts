// সব জায়গায় API URL এখান থেকেই নেবে

const raw =
    import.meta.env.VITE_BASE_URL;

if (!raw) {
    // env না পেলে console এ পরিষ্কার error দেখাবে
    console.error(
        '[config] VITE_BASE_URL পাওয়া যায়নি। ' +
        'Project root এ .env.development / .env.production আছে কিনা দেখুন, ' +
        'তারপর dev server restart করুন।'
    );
}

// যেমন: https://backend.akashbariresort.com/api
export const API_BASE_URL = (raw || '').replace(/\/+$/, '');

// যেমন: https://backend.akashbariresort.com  (ছবি / storage এর জন্য)
export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');

// Laravel storage এর ছবির পুরো URL
export const storageUrl = (path, folder = '') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    let clean = path.split('?')[0].replace(/^\/+/, '').replace(/^storage\//, '');
    if (folder && !clean.startsWith(`${folder}/`)) clean = `${folder}/${clean}`;

    return `${BACKEND_URL}/storage/${clean}`;
};