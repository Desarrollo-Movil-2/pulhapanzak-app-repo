import { ICharacter } from "./IPersonaje"
export interface ICharacters{
    info: {
        count: number,
        next?: string ,
        pages:number,
        prev?:string
    },
    results: ICharacter[]
}