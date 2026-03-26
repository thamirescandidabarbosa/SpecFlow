const ghPagesBasePath = '/SpecFlow';

const normalizePublicUrl = (value?: string) => {
    if (!value || value === '.' || value === './') {
        return '';
    }

    return value.endsWith('/') ? value.slice(0, -1) : value;
};

export const getAppBasePath = () => {
    const publicUrl = normalizePublicUrl(process.env.PUBLIC_URL);

    if (typeof window === 'undefined') {
        return publicUrl;
    }

    const pathname = window.location.pathname || '';

    if (pathname === ghPagesBasePath || pathname.startsWith(`${ghPagesBasePath}/`)) {
        return ghPagesBasePath;
    }

    return process.env.NODE_ENV === 'production' ? publicUrl : '';
};

export const withAppBasePath = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getAppBasePath()}${normalizedPath}`;
};
