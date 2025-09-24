import 'package:firebase_auth/firebase_auth.dart';
import '../../data/models/auth_models.dart';

abstract class AuthRepository {
  // Email & Password Authentication
  Future<AuthResult> signInWithEmailAndPassword(String email, String password);
  Future<AuthResult> registerWithEmailAndPassword(
    String email,
    String password, {
    String? firstName,
    String? lastName,
    String? phoneNumber,
  });

  // OAuth Authentication
  Future<AuthResult> signInWithGoogle();
  Future<AuthResult> signInWithFacebook();
  Future<AuthResult> signInWithApple();

  // Biometric Authentication
  Future<AuthResult> signInWithBiometrics();
  Future<bool> isBiometricAvailable();
  Future<bool> isBiometricEnabled();
  Future<void> enableBiometric();
  Future<void> disableBiometric();

  // Phone Authentication
  Future<void> verifyPhoneNumber(
    String phoneNumber,
    Function(PhoneAuthCredential) verificationCompleted,
    Function(FirebaseAuthException) verificationFailed,
    Function(String, int?) codeSent,
    Function(String) codeAutoRetrievalTimeout,
  );

  // Password Management
  Future<void> sendPasswordResetEmail(String email);
  Future<void> changePassword(String currentPassword, String newPassword);
  Future<AuthResult> resetPasswordWithToken(String token, String newPassword);

  // Email Verification
  Future<void> sendEmailVerification();
  Future<bool> isEmailVerified();
  Future<AuthResult> verifyEmailWithToken(String token);

  // Multi-Factor Authentication
  Future<void> enableTwoFactorAuth();
  Future<void> disableTwoFactorAuth();
  Future<AuthResult> verifyTwoFactorCode(String code);
  Future<void> sendTwoFactorCode();

  // Session Management
  Future<void> signOut();
  Future<void> signOutFromAllDevices();
  Future<User?> getCurrentUser();
  Stream<User?> get authStateChanges;
  Future<String?> getIdToken();
  Future<void> refreshToken();

  // Account Management
  Future<void> deleteAccount();
  Future<AuthResult> linkAccount(AuthCredential credential);
  Future<void> unlinkAccount(String providerId);
  Future<List<UserInfo>> getLinkedAccounts();

  // Profile Management
  Future<void> updateProfile({
    String? displayName,
    String? photoURL,
    String? phoneNumber,
  });

  // Security
  Future<List<AuthSession>> getActiveSessions();
  Future<void> revokeSession(String sessionId);
  Future<SecuritySettings> getSecuritySettings();
  Future<void> updateSecuritySettings(SecuritySettings settings);
}
