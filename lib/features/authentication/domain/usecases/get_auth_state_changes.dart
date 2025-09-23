import 'package:firebase_auth/firebase_auth.dart';
import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class GetAuthStateChanges {
  final AuthRepository _repository;

  GetAuthStateChanges(this._repository);

  Stream<User?> call() {
    return _repository.authStateChanges;
  }
}
