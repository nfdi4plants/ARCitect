/** GitLab App authentication with Secret */
type AuthWithSecret = {
    id: string;
    secret: string;
};

/** GitLab App authentication without Secret */
type AuthIdOnly = {
    id: string;
    secret?: never;
};
  
/** Store credetials for different datahubs. 
Keys are adresses for the datahub.*/
export interface Credentials {
    [key : string] : AuthWithSecret | AuthIdOnly ;
}
  
type User = {token: string; host: string}