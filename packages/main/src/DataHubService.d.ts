/** GitLab App authentication with Secret */
export type AuthWithSecret = {
    id: string;
    secret: string;
};

/** GitLab App authentication without Secret */
export type AuthIdOnly = {
    id: string;
    secret?: never;
};

/** a dict that stores credentials for different Datahubs*/
export interface CredentialDict {
    [key : string] : AuthWithSecret | AuthIdOnly ;
}

/** Store credetials for different datahubs. 
Keys are adresses for the datahub.*/
export interface Credentials {
    dataplant: CredentialDict;
    additional: CredentialDict;
}

export interface Hosts{
    dataplant: string[];
    additional: string[];
}

export interface CredentialStoreType {
    credential_file_dataplant: string,
    credential_file_additional: string,
    credentials: Credentials,

    /** init the CredentialStore */
    init: () => void
    /** get credentials for given key */
    getCredentials: (key: string) => AuthWithSecret | AuthIdOnly,
    /** check if certain credentials already exist */
    credentialsExist: (key: string) => boolean,
    /** add credentials for a given key */
    addCredentials: (key: string, credentials: AuthWithSecret | AuthIdOnly) => void
    /** get host names by sorted in dataplant and additional */
    removeCredentials: (key: string) => void
    /** remove credentials for hostname */
    getHosts: () => Hosts
}
  
type User = {token: string; host: string}