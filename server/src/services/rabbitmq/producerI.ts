export interface Producer {
    push(msg: string): boolean;
}
