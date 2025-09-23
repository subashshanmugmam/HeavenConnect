import 'package:firebase_auth/firebase_auth.dart';
import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class RegisterWithEmail {
  final AuthRepository _repository;

  RegisterWithEmail(this._repository);

  Future<User?> call(String email, String password) async {
    return await _repository.registerWithEmailAndPassword(email, password);
  }
}
