import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class SendPasswordResetEmail {
  final AuthRepository _repository;

  SendPasswordResetEmail(this._repository);

  Future<void> call(String email) async {
    return await _repository.sendPasswordResetEmail(email);
  }
}
