import '../repositories/auth_repository.dart';
import '../../data/models/auth_models.dart';

class SignInWithEmail {
  final AuthRepository _repository;

  SignInWithEmail(this._repository);

  Future<AuthResult> call(String email, String password) async {
    return await _repository.signInWithEmailAndPassword(email, password);
  }
}
