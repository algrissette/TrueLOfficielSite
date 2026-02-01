// TypeScript interface for a row in USER_SAVED
export interface IUserSaved {
    id?: number;        // auto-incremented
    userId: number;     // FK to USERS.id
    variant: string;
    quantity: number;  // the saved variant
}
