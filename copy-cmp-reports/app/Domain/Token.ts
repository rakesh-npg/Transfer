import { ensureArray, ensureNonEmptyString, ensurePositiveInteger } from './Helpers/Validations'

export default class Token {
  constructor(
    public readonly uid: string,
    public readonly claims: {
      name: string
      email: string
      roles: string[]
    },
    public readonly aud: string,
    public readonly iss: string,
    public readonly sub: string,
    public readonly iat: number,
    public readonly exp: number
  ) {
    this.uid = ensureNonEmptyString(uid, 'BAD_TOKEN_USER_ID')
    this.claims = {
      name: ensureNonEmptyString(claims.name, 'BAD_TOKEN_CLAIM_NAME'),
      email: ensureNonEmptyString(claims.email, 'BAD_TOKEN_CLAIM_EMAIL'),
      roles: ensureArray(claims.roles, 'BAD_TOKEN_CLAIM_ROLES_TYPE').map((roleKey) =>
        ensureNonEmptyString(roleKey, 'BAD_TOKEN_CLAIM_ROLES_KEY')
      ),
    }
    this.aud = ensureNonEmptyString(aud, 'BAD_TOKEN_AUD')
    this.iss = ensureNonEmptyString(iss, 'BAD_TOKEN_ISS')
    this.sub = ensureNonEmptyString(sub, 'BAD_TOKEN_SUB')
    this.iat = ensurePositiveInteger(iat, 'BAD_TOKEN_IAT')
    this.exp = ensurePositiveInteger(exp, 'BAD_TOKEN_EXP')
  }

  public static fromJSON = (json: any) =>
    new Token(json.uid, json.claims, json.aud, json.iss, json.sub, json.iat, json.exp)

  public get asJSONv1() {
    return {
      uid: this.uid,
      claims: this.claims,
      aud: this.aud,
      iss: this.iss,
      sub: this.sub,
      iat: this.iat,
      exp: this.exp,
    }
  }
}
