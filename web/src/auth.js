import { createDbAuthClient, createAuth } from '@redwoodjs/auth-dbauth-web'
import WebAuthnClient from '@redwoodjs/auth-dbauth-web/webAuthn'

const dbAuthClient = createDbAuthClient({ webAuthn: new WebAuthnClient() })

const customAuthClient = {
  ...dbAuthClient,
}

export const { AuthProvider, useAuth } = createAuth(customAuthClient)
