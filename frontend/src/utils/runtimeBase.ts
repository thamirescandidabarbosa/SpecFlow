const normalizePublicUrl = (value?: string) => {
    if (!value || value === '.' || value === './') {
        return '';
    }

    return value.endsWith('/') ? value.slice(0, -1) : value;
};

export const getAppBasePath = () => {
    const publicUrl = normalizePublicUrl(process.env.PUBLIC_URL);
    return process.env.NODE_ENV === 'production' ? publicUrl : '';
};

export const withAppBasePath = (path: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${getAppBasePath()}${normalizedPath}`;
};
