const ghPagesBasePath = '/SpecFlow';

export const getAppBasePath = () => {
    if (typeof window === 'undefined') {
        return process.env.PUBLIC_URL || '';
    }

    const pathname = window.location.pathname || '';

    if (pathname === ghPagesBasePath || pathname.startsWith(`${ghPagesBasePath}/`)) {
        return ghPagesBasePath;
    }

    return process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL || '' : '';
};

export const withAppBasePath = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getAppBasePath()}${normalizedPath}`;
};
