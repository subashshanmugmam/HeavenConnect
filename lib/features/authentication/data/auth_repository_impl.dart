import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../domain/repositories/auth_repository.dart';
import 'models/auth_models.dart';
import 'services/biometric_service.dart';

class AuthRepositoryImpl implements AuthRepository {
  final FirebaseAuth _firebaseAuth;
  final GoogleSignIn _googleSignIn;
  final BiometricService _biometricService;

  AuthRepositoryImpl({
    FirebaseAuth? firebaseAuth,
    GoogleSignIn? googleSignIn,
    BiometricService? biometricService,
  })  : _firebaseAuth = firebaseAuth ?? FirebaseAuth.instance,
        _googleSignIn = googleSignIn ?? GoogleSignIn(),
        _biometricService = biometricService ?? BiometricService();

  @override
  Future<AuthResult> signInWithEmailAndPassword(
      String email, String password) async {
    try {
      final UserCredential userCredential =
          await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user != null) {
        final token = await userCredential.user!.getIdToken();
        return AuthResult.success(
          user: userCredential.user,
          accessToken: token,
        );
      } else {
        return AuthResult.failure(
          message: 'Authentication failed',
          errorCode: 'auth_failed',
        );
      }
    } on FirebaseAuthException catch (e) {
      return AuthResult.failure(
        message: e.message ?? 'Authentication failed',
        errorCode: e.code,
      );
    } catch (e) {
      return AuthResult.failure(
        message: 'An unknown error occurred',
        errorCode: 'unknown_error',
      );
    }
  }

  @override
  Future<AuthResult> registerWithEmailAndPassword(
    String email,
    String password, {
    String? firstName,
    String? lastName,
    String? phoneNumber,
  }) async {
    try {
      final UserCredential userCredential =
          await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user != null) {
        // Update display name if provided
        if (firstName != null || lastName != null) {
          final displayName = '${firstName ?? ''} ${lastName ?? ''}'.trim();
          await userCredential.user!.updateDisplayName(displayName);
        }

        final token = await userCredential.user!.getIdToken();
        return AuthResult.success(
          user: userCredential.user,
          accessToken: token,
        );
      } else {
        return AuthResult.failure(
          message: 'Registration failed',
          errorCode: 'registration_failed',
        );
      }
    } on FirebaseAuthException catch (e) {
      return AuthResult.failure(
        message: e.message ?? 'Registration failed',
        errorCode: e.code,
      );
    } catch (e) {
      return AuthResult.failure(
        message: 'An unknown error occurred',
        errorCode: 'unknown_error',
      );
    }
  }

  @override
  Future<AuthResult> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        return AuthResult.failure(
          message: 'Google sign-in was cancelled',
          errorCode: 'sign_in_cancelled',
        );
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential =
          await _firebaseAuth.signInWithCredential(credential);

      if (userCredential.user != null) {
        final token = await userCredential.user!.getIdToken();
        return AuthResult.success(
          user: userCredential.user,
          accessToken: token,
        );
      } else {
        return AuthResult.failure(
          message: 'Google authentication failed',
          errorCode: 'google_auth_failed',
        );
      }
    } catch (e) {
      return AuthResult.failure(
        message: 'Google sign-in failed: ${e.toString()}',
        errorCode: 'google_sign_in_error',
      );
    }
  }

  @override
  Future<AuthResult> signInWithFacebook() async {
    // TODO: Implement Facebook sign-in
    return AuthResult.failure(
      message: 'Facebook sign-in not implemented',
      errorCode: 'not_implemented',
    );
  }

  @override
  Future<AuthResult> signInWithApple() async {
    // TODO: Implement Apple sign-in
    return AuthResult.failure(
      message: 'Apple sign-in not implemented',
      errorCode: 'not_implemented',
    );
  }

  @override
  Future<AuthResult> signInWithBiometrics() async {
    try {
      final bool isAvailable = await _biometricService.isBiometricAvailable();
      if (!isAvailable) {
        return AuthResult.failure(
          message: 'Biometric authentication not available',
          errorCode: 'biometric_not_available',
        );
      }

      final bool isEnabled = await _biometricService.isBiometricEnabled();
      if (!isEnabled) {
        return AuthResult.failure(
          message: 'Biometric authentication not enabled. Please enable it in settings.',
          errorCode: 'biometric_not_enabled',
        );
      }

      final Map<String, String>? credentials = 
          await _biometricService.authenticateWithBiometrics();

      if (credentials != null) {
        // Use stored credentials to sign in with Firebase
        return await signInWithEmailAndPassword(
          credentials['email']!,
          credentials['password']!,
        );
      } else {
        return AuthResult.failure(
          message: 'Biometric authentication failed',
          errorCode: 'biometric_failed',
        );
      }
    } catch (e) {
      return AuthResult.failure(
        message: 'Biometric authentication error: ${e.toString()}',
        errorCode: 'biometric_error',
      );
    }
  }

  @override
  Future<bool> isBiometricAvailable() async {
    try {
      return await _biometricService.isBiometricAvailable();
    } catch (e) {
      return false;
    }
  }

  @override
  Future<bool> isBiometricEnabled() async {
    try {
      return await _biometricService.isBiometricEnabled();
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> enableBiometric() async {
    try {
      final User? currentUser = _firebaseAuth.currentUser;
      if (currentUser?.email != null) {
        // Note: In a real app, you wouldn't store the password like this
        // This is a simplified implementation for demonstration
        throw UnimplementedError(
          'Biometric setup requires password. Use enableBiometricWithCredentials instead.',
        );
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> disableBiometric() async {
    try {
      await _biometricService.disableBiometric();
    } catch (e) {
      rethrow;
    }
  }

  /// Helper method to enable biometric with credentials
  Future<bool> enableBiometricWithCredentials(String email, String password) async {
    try {
      return await _biometricService.enableBiometric(email, password);
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> verifyPhoneNumber(
    String phoneNumber,
    Function(PhoneAuthCredential) verificationCompleted,
    Function(FirebaseAuthException) verificationFailed,
    Function(String, int?) codeSent,
    Function(String) codeAutoRetrievalTimeout,
  ) async {
    await _firebaseAuth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: verificationCompleted,
      verificationFailed: verificationFailed,
      codeSent: codeSent,
      codeAutoRetrievalTimeout: codeAutoRetrievalTimeout,
    );
  }

  @override
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message);
    } catch (e) {
      throw Exception('An unknown error occurred');
    }
  }

  @override
  Future<void> changePassword(
      String currentPassword, String newPassword) async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    try {
      // Re-authenticate the user
      final credential = EmailAuthProvider.credential(
        email: user.email!,
        password: currentPassword,
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message);
    }
  }

  @override
  Future<AuthResult> resetPasswordWithToken(
      String token, String newPassword) async {
    // TODO: Implement password reset with token
    return AuthResult.failure(
      message: 'Password reset with token not implemented',
      errorCode: 'not_implemented',
    );
  }

  @override
  Future<void> sendEmailVerification() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    await user.sendEmailVerification();
  }

  @override
  Future<bool> isEmailVerified() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return false;

    await user.reload();
    return user.emailVerified;
  }

  @override
  Future<AuthResult> verifyEmailWithToken(String token) async {
    // TODO: Implement email verification with token
    return AuthResult.failure(
      message: 'Email verification with token not implemented',
      errorCode: 'not_implemented',
    );
  }

  @override
  Future<void> enableTwoFactorAuth() async {
    // TODO: Implement 2FA enable
  }

  @override
  Future<void> disableTwoFactorAuth() async {
    // TODO: Implement 2FA disable
  }

  @override
  Future<AuthResult> verifyTwoFactorCode(String code) async {
    // TODO: Implement 2FA verification
    return AuthResult.failure(
      message: '2FA verification not implemented',
      errorCode: 'not_implemented',
    );
  }

  @override
  Future<void> sendTwoFactorCode() async {
    // TODO: Implement 2FA code sending
  }

  @override
  Future<void> signOut() async {
    await Future.wait([
      _firebaseAuth.signOut(),
      _googleSignIn.signOut(),
    ]);
  }

  @override
  Future<void> signOutFromAllDevices() async {
    // TODO: Implement sign out from all devices
    await signOut();
  }

  @override
  Future<User?> getCurrentUser() async {
    return _firebaseAuth.currentUser;
  }

  @override
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  @override
  Future<String?> getIdToken() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return null;

    return await user.getIdToken();
  }

  @override
  Future<void> refreshToken() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return;

    await user.getIdToken(true);
  }

  @override
  Future<void> deleteAccount() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    await user.delete();
  }

  @override
  Future<AuthResult> linkAccount(AuthCredential credential) async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      return AuthResult.failure(
        message: 'No user signed in',
        errorCode: 'no_user',
      );
    }

    try {
      await user.linkWithCredential(credential);
      return AuthResult.success(user: user);
    } on FirebaseAuthException catch (e) {
      return AuthResult.failure(
        message: e.message ?? 'Account linking failed',
        errorCode: e.code,
      );
    }
  }

  @override
  Future<void> unlinkAccount(String providerId) async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    await user.unlink(providerId);
  }

  @override
  Future<List<UserInfo>> getLinkedAccounts() async {
    final user = _firebaseAuth.currentUser;
    if (user == null) return [];

    return user.providerData;
  }

  @override
  Future<void> updateProfile({
    String? displayName,
    String? photoURL,
    String? phoneNumber,
  }) async {
    final user = _firebaseAuth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    if (displayName != null) {
      await user.updateDisplayName(displayName);
    }

    if (photoURL != null) {
      await user.updatePhotoURL(photoURL);
    }

    // Note: Phone number update requires re-authentication
    // This is a simplified implementation
  }

  @override
  Future<List<AuthSession>> getActiveSessions() async {
    // TODO: Implement session management
    return [];
  }

  @override
  Future<void> revokeSession(String sessionId) async {
    // TODO: Implement session revocation
  }

  @override
  Future<SecuritySettings> getSecuritySettings() async {
    // TODO: Implement security settings retrieval
    return const SecuritySettings();
  }

  @override
  Future<void> updateSecuritySettings(SecuritySettings settings) async {
    // TODO: Implement security settings update
  }
}
