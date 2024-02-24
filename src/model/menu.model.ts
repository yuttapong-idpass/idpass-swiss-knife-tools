import { IconType } from "react-icons"


export interface IMenu {
    name: string,
    active: boolean,
    icon: IconType
    link: string
}