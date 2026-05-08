export declare const Roles: {
    readonly STUDENT: "STUDENT";
    readonly CAFETERIA: "CAFETERIA";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Roles)[keyof typeof Roles];
