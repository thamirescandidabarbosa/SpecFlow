export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

export const PASSWORD_MESSAGE =
    'A senha deve ter pelo menos 8 caracteres, com letra maiuscula, minuscula, numero e caractere especial';
