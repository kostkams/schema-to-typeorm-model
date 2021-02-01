export enum EType {
    'string',
    'boolean',
    'number',
    'date'
}

export enum EIdType {
    'uuid',
    'number',
}
export interface IProperty {
    name: string;
    required?: boolean;
    type: EType;
}

export interface ISchema {
    name: string;
    id: EIdType;
    properties: IProperty[]
}
