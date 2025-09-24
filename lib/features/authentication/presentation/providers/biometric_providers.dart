import 'package:local_auth/local_auth.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/services/biometric_service.dart';

part 'biometric_providers.g.dart';

/// Provider for biometric service
@riverpod
BiometricService biometricService(BiometricServiceRef ref) {
  return BiometricService();
}

/// Provider to check if biometric authentication is available
@riverpod
Future<bool> isBiometricAvailable(IsBiometricAvailableRef ref) async {
  final biometricService = ref.read(biometricServiceProvider);
  return await biometricService.isBiometricAvailable();
}

/// Provider to check if biometric authentication is enabled
@riverpod
Future<bool> isBiometricEnabled(IsBiometricEnabledRef ref) async {
  final biometricService = ref.read(biometricServiceProvider);
  return await biometricService.isBiometricEnabled();
}

/// Provider to get available biometric types
@riverpod
Future<List<BiometricType>> availableBiometrics(
    AvailableBiometricsRef ref) async {
  final biometricService = ref.read(biometricServiceProvider);
  return await biometricService.getAvailableBiometrics();
}

/// Provider for biometric authentication
@riverpod
Future<void> authenticateWithBiometrics(
    AuthenticateWithBiometricsRef ref) async {
  final authRepo = ref.read(authRepositoryProvider);
  await authRepo.signInWithBiometrics();
}

/// Provider to enable biometric authentication
@riverpod
Future<bool> enableBiometric(
    EnableBiometricRef ref, String email, String password) async {
  final biometricService = ref.read(biometricServiceProvider);
  return await biometricService.enableBiometric(email, password);
}

/// Provider to disable biometric authentication
@riverpod
Future<void> disableBiometric(DisableBiometricRef ref) async {
  final biometricService = ref.read(biometricServiceProvider);
  await biometricService.disableBiometric();
}
