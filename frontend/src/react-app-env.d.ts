/// <reference types="react" />

declare module 'react' {
    interface ReactNode {
        children?: ReactNode;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

export { };
