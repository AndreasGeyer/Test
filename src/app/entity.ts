export class FusekiResult {
    head: {
        vars: string[]
    };
    results: {
        bindings: Entity[]
    };
}

export class Entity{
    entityName: {
        type: string,
        value: string
    };
}