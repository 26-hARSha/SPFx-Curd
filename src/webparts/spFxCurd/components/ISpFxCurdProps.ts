import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpFxCurdProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;


  siteUrl:string;
  listName:string;
  context:WebPartContext;
}
