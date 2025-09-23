import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class SignOut {
  final AuthRepository _repository;

  SignOut(this._repository);

  Future<void> call() async {
    return await _repository.signOut();
  }
}
