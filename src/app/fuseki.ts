export class Complete {
    head: {
        var: string[]
    };
    results:{
        bindings: Binding[]
    };
}

export class Binding{
    autorID: {
        type: string,
        value: string
    };
    autorName: {
        type: string,
        value: string
    };
    autorDescription: {
        type: string,
        value: string
    };
    autorFollowerCount: {
        type: string,
        value: string
    };
    tweetID: {
        type: string,
        value: string
    };
    tweetText: {
        type: string,
        value: string
    };
    subject: {
        type: string,
        value: string
    };
    subjectEntity: {
        type: string,
        value: string
    };
    verb: {
        type: string,
        value: string
    };
    object: {
        type: string,
        value: string
    };
    objectEntity: {
        type: string,
        value: string
    };
    keyWord: {
        type: string,
        value: string
    };
}