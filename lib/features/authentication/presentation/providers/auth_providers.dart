import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/repositories/auth_repository.dart';
import '../../../../shared/models/user_model.dart';

part 'auth_providers.g.dart';

@riverpod
Future<void> signInWithEmail(SignInWithEmailRef ref, String email, String password) async {
  final authRepo = ref.read(authRepositoryProvider);
  await authRepo.login(email, password);
}

@riverpod
Future<void> registerWithEmail(RegisterWithEmailRef ref, String email, String password, String fullName) async {
  final authRepo = ref.read(authRepositoryProvider);
  await authRepo.register(email, password, fullName);
}

@riverpod
Future<void> signOut(SignOutRef ref) async {
  final authRepo = ref.read(authRepositoryProvider);
  await authRepo.logout();
}

@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AsyncValue<UserModel?> build() {
    return const AsyncValue.data(null);
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final authRepo = ref.read(authRepositoryProvider);
      final success = await authRepo.login(email, password);
      if (success) {
        // Create a mock user for now
        final user = UserModel(
          id: '1',
          email: email,
          firstName: 'Mock',
          lastName: 'User',
          role: UserRole.member,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        );
        state = AsyncValue.data(user);
      } else {
        state = const AsyncValue.error('Login failed', StackTrace.empty);
      }
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    try {
      final authRepo = ref.read(authRepositoryProvider);
      await authRepo.logout();
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}
