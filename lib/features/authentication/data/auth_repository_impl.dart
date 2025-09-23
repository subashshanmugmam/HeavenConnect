import 'package:firebase_auth/firebase_auth.dart';
import 'package:hcsub/features/authentication/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final FirebaseAuth _firebaseAuth;

  AuthRepositoryImpl(this._firebaseAuth);

  @override
  Future<User?> signInWithEmailAndPassword(String email, String password) async {
    try {
      final UserCredential userCredential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential.user;
    } on FirebaseAuthException catch (e) {
      // Handle Firebase specific errors
      throw Exception(e.message);
    } catch (e) {
      // Handle other errors
      throw Exception('An unknown error occurred');
    }
  }

  @override
  Future<User?> registerWithEmailAndPassword(String email, String password) async {
    try {
      final UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      return userCredential.user;
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message);
    } catch (e) {
      throw Exception('An unknown error occurred');
    }
  }

  @override
  Future<void> signOut() async {
    await _firebaseAuth.signOut();
  }

  @override
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();

  @override
  Future<void> sendPasswordResetEmail(String email) async {
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message);
    } catch (e) {
      throw Exception('An unknown error occurred');
    }
  }

  @override
  Future<void> signInWithGoogle() {
    // TODO: implement signInWithGoogle
    throw UnimplementedError();
  }

  @override
  Future<void> signInWithBiometrics() {
    // TODO: implement signInWithBiometrics
    throw UnimplementedError();
  }

  @override
  Future<void> verifyPhoneNumber(String phoneNumber, Function(PhoneAuthCredential) verificationCompleted, Function(FirebaseAuthException) verificationFailed, Function(String, int?) codeSent, Function(String) codeAutoRetrievalTimeout) {
    // TODO: implement verifyPhoneNumber
    throw UnimplementedError();
  }
}
