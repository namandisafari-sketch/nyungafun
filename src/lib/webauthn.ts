/**
 * WebAuthn helpers for fingerprint registration and verification.
 * Uses the browser's built-in WebAuthn API to interact with fingerprint scanners.
 * 
 * Registration: Uses navigator.credentials.create() — one-time setup per device.
 * Verification: Uses navigator.credentials.get() — daily clock-in/out & passkey login.
 */

// Convert ArrayBuffer to base64url string
function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Convert base64url string to ArrayBuffer
function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a random challenge
function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

export function isWebAuthnSupported(): boolean {
  return !!(window.PublicKeyCredential && navigator.credentials);
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export interface WebAuthnCredential {
  credentialId: string;
  publicKey: string;
  counter: number;
}

/**
 * Register a new fingerprint credential for a user.
 * This triggers the platform authenticator (Windows Hello / Touch ID).
 * Creates a discoverable credential (passkey) so it can be used for login too.
 */
export async function registerFingerprint(
  userId: string,
  userName: string,
  userDisplayName: string
): Promise<WebAuthnCredential> {
  const challenge = generateChallenge();

  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge as unknown as BufferSource,
    rp: {
      name: "Kabejja Data Centre",
      id: window.location.hostname,
    },
    user: {
      id: new TextEncoder().encode(userId),
      name: userName,
      displayName: userDisplayName,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },   // ES256
      { alg: -257, type: "public-key" },  // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      // "required" makes it a discoverable credential (passkey) for passwordless login
      residentKey: "required",
      requireResidentKey: true,
    },
    timeout: 60000,
    attestation: "none",
  };

  const credential = (await navigator.credentials.create({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Fingerprint registration was cancelled or failed");
  }

  const response = credential.response as AuthenticatorAttestationResponse;

  return {
    credentialId: bufferToBase64url(credential.rawId),
    publicKey: bufferToBase64url(response.attestationObject),
    counter: 0,
  };
}

/**
 * Verify a fingerprint against stored credentials (for clock-in/out).
 * Uses get() which shows ONLY the fingerprint prompt — no passkey creation dialog.
 */
export async function verifyFingerprint(
  allowedCredentials: { credentialId: string }[]
): Promise<{ credentialId: string; verified: boolean }> {
  if (allowedCredentials.length === 0) {
    throw new Error("No registered fingerprints found. Please register first.");
  }

  const challenge = generateChallenge();

  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge as unknown as BufferSource,
    rpId: window.location.hostname,
    allowCredentials: allowedCredentials.map((cred) => ({
      id: base64urlToBuffer(cred.credentialId) as unknown as BufferSource,
      type: "public-key" as const,
      transports: ["internal" as AuthenticatorTransport],
    })),
    userVerification: "required",
    timeout: 60000,
  };

  const assertion = (await navigator.credentials.get({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error("Fingerprint verification was cancelled or failed");
  }

  return {
    credentialId: bufferToBase64url(assertion.rawId),
    verified: true,
  };
}

/**
 * Passkey login — uses discoverable credentials (no allowCredentials needed).
 * The browser shows the fingerprint prompt and picks the stored passkey automatically.
 * Returns the credential ID which can be looked up to identify the user.
 */
export async function loginWithPasskey(): Promise<{
  credentialId: string;
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
}> {
  if (!isWebAuthnSupported()) {
    throw new Error("Passkeys are not supported on this device");
  }

  const challenge = generateChallenge();

  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge as unknown as BufferSource,
    rpId: window.location.hostname,
    // Empty allowCredentials = discoverable credential flow (passkey login)
    allowCredentials: [],
    userVerification: "required",
    timeout: 60000,
  };

  const assertion = (await navigator.credentials.get({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error("Passkey login was cancelled or failed");
  }

  const response = assertion.response as AuthenticatorAssertionResponse;

  return {
    credentialId: bufferToBase64url(assertion.rawId),
    authenticatorData: bufferToBase64url(response.authenticatorData),
    clientDataJSON: bufferToBase64url(response.clientDataJSON),
    signature: bufferToBase64url(response.signature),
  };
}
