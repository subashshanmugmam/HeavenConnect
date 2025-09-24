import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth/error_codes.dart' as auth_error;

/// Service for managing biometric authentication and secure storage
class BiometricService {
  static const BiometricService _instance = BiometricService._internal();
  factory BiometricService() => _instance;
  const BiometricService._internal();

  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );

  static final LocalAuthentication _localAuth = LocalAuthentication();

  // Storage keys
  static const String _keyBiometricEnabled = 'biometric_enabled';
  static const String _keyStoredEmail = 'stored_email';
  static const String _keyStoredPassword = 'stored_password';

  /// Check if biometric authentication is available on the device
  Future<bool> isBiometricAvailable() async {
    try {
      return await _localAuth.canCheckBiometrics;
    } catch (e) {
      return false;
    }
  }

  /// Get available biometric types
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } catch (e) {
      return [];
    }
  }

  /// Check if biometric authentication is enabled for this user
  Future<bool> isBiometricEnabled() async {
    try {
      final String? enabled = await _secureStorage.read(key: _keyBiometricEnabled);
      return enabled == 'true';
    } catch (e) {
      return false;
    }
  }

  /// Enable biometric authentication and store credentials securely
  Future<bool> enableBiometric(String email, String password) async {
    try {
      // First authenticate with biometrics to ensure it works
      final bool authenticated = await _authenticateWithBiometrics(
        'Enable biometric authentication for your account',
      );

      if (!authenticated) {
        return false;
      }

      // Store credentials securely
      await _secureStorage.write(key: _keyStoredEmail, value: email);
      await _secureStorage.write(key: _keyStoredPassword, value: password);
      await _secureStorage.write(key: _keyBiometricEnabled, value: 'true');

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Disable biometric authentication and clear stored credentials
  Future<void> disableBiometric() async {
    try {
      await _secureStorage.delete(key: _keyBiometricEnabled);
      await _secureStorage.delete(key: _keyStoredEmail);
      await _secureStorage.delete(key: _keyStoredPassword);
    } catch (e) {
      // Handle error silently
    }
  }

  /// Authenticate with biometrics and return stored credentials
  Future<Map<String, String>?> authenticateWithBiometrics() async {
    try {
      final bool isEnabled = await isBiometricEnabled();
      if (!isEnabled) {
        return null;
      }

      final bool authenticated = await _authenticateWithBiometrics(
        'Please authenticate to sign in to your account',
      );

      if (!authenticated) {
        return null;
      }

      // Retrieve stored credentials
      final String? email = await _secureStorage.read(key: _keyStoredEmail);
      final String? password = await _secureStorage.read(key: _keyStoredPassword);

      if (email != null && password != null) {
        return {
          'email': email,
          'password': password,
        };
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /// Private method to handle biometric authentication
  Future<bool> _authenticateWithBiometrics(String reason) async {
    try {
      final bool isAvailable = await _localAuth.canCheckBiometrics;
      if (!isAvailable) {
        return false;
      }

      final List<BiometricType> availableBiometrics = 
          await _localAuth.getAvailableBiometrics();
      
      if (availableBiometrics.isEmpty) {
        return false;
      }

      return await _localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
    } on PlatformException catch (e) {
      // Handle specific biometric errors
      switch (e.code) {
        case auth_error.notAvailable:
          return false;
        case auth_error.notEnrolled:
          return false;
        case auth_error.lockedOut:
          return false;
        case auth_error.permanentlyLockedOut:
          return false;
        default:
          return false;
      }
    } catch (e) {
      return false;
    }
  }

  /// Get human-readable biometric type names
  String getBiometricTypeName(List<BiometricType> types) {
    if (types.contains(BiometricType.face)) {
      return 'Face ID';
    } else if (types.contains(BiometricType.fingerprint)) {
      return 'Fingerprint';
    } else if (types.contains(BiometricType.iris)) {
      return 'Iris';
    } else if (types.contains(BiometricType.strong)) {
      return 'Biometric';
    } else if (types.contains(BiometricType.weak)) {
      return 'Biometric';
    }
    return 'Biometric';
  }

  /// Clear all stored data (useful for logout)
  Future<void> clearAllData() async {
    try {
      await _secureStorage.deleteAll();
    } catch (e) {
      // Handle error silently
    }
  }
}