import '../repositories/auth_repository.dart';
import '../../data/models/auth_models.dart';

class RegisterWithEmail {
  final AuthRepository _repository;

  RegisterWithEmail(this._repository);

  Future<AuthResult> call(
    String email,
    String password, {
    String? firstName,
    String? lastName,
    String? phoneNumber,
  }) async {
    return await _repository.registerWithEmailAndPassword(
      email,
      password,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    );
  }
}
