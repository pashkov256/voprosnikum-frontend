export interface IGroup {
    name: string;
    _id: string;
    created_at: string;
    teachers: {_id:string,fullName:string}[];
}
