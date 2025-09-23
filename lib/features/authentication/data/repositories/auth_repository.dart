import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_repository.g.dart';

@riverpod
AuthRepository authRepository(AuthRepositoryRef ref) {
  return AuthRepository();
}

class AuthRepository {
  // Simple placeholder authentication repository
  Future<bool> login(String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    return email.isNotEmpty && password.isNotEmpty;
  }

  Future<bool> register(String email, String password, String name) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    return email.isNotEmpty && password.isNotEmpty && name.isNotEmpty;
  }

  Future<void> logout() async {
    // Simulate logout
    await Future.delayed(const Duration(milliseconds: 500));
  }

  Future<bool> isLoggedIn() async {
    // Simulate checking login status
    return false;
  }
}