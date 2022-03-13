export default function verificationGuard(verifiedState: boolean) {
  if (verifiedState) {
    return true;
  } else {
    return false;
  }
}
