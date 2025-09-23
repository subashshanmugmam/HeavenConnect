import 'package:firebase_auth/firebase_auth.dart';
import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class SignInWithEmail {
  final AuthRepository _repository;

  SignInWithEmail(this._repository);

  Future<User?> call(String email, String password) async {
    return await _repository.signInWithEmailAndPassword(email, password);
  }
}
