// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$signInWithEmailHash() => r'035b7c82d7fac02ba474ea8cc20582b561563b2d';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [signInWithEmail].
@ProviderFor(signInWithEmail)
const signInWithEmailProvider = SignInWithEmailFamily();

/// See also [signInWithEmail].
class SignInWithEmailFamily extends Family<AsyncValue<void>> {
  /// See also [signInWithEmail].
  const SignInWithEmailFamily();

  /// See also [signInWithEmail].
  SignInWithEmailProvider call(
    String email,
    String password,
  ) {
    return SignInWithEmailProvider(
      email,
      password,
    );
  }

  @override
  SignInWithEmailProvider getProviderOverride(
    covariant SignInWithEmailProvider provider,
  ) {
    return call(
      provider.email,
      provider.password,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'signInWithEmailProvider';
}

/// See also [signInWithEmail].
class SignInWithEmailProvider extends AutoDisposeFutureProvider<void> {
  /// See also [signInWithEmail].
  SignInWithEmailProvider(
    String email,
    String password,
  ) : this._internal(
          (ref) => signInWithEmail(
            ref as SignInWithEmailRef,
            email,
            password,
          ),
          from: signInWithEmailProvider,
          name: r'signInWithEmailProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$signInWithEmailHash,
          dependencies: SignInWithEmailFamily._dependencies,
          allTransitiveDependencies:
              SignInWithEmailFamily._allTransitiveDependencies,
          email: email,
          password: password,
        );

  SignInWithEmailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.email,
    required this.password,
  }) : super.internal();

  final String email;
  final String password;

  @override
  Override overrideWith(
    FutureOr<void> Function(SignInWithEmailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: SignInWithEmailProvider._internal(
        (ref) => create(ref as SignInWithEmailRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        email: email,
        password: password,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<void> createElement() {
    return _SignInWithEmailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is SignInWithEmailProvider &&
        other.email == email &&
        other.password == password;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, email.hashCode);
    hash = _SystemHash.combine(hash, password.hashCode);

    return _SystemHash.finish(hash);
  }
}

mixin SignInWithEmailRef on AutoDisposeFutureProviderRef<void> {
  /// The parameter `email` of this provider.
  String get email;

  /// The parameter `password` of this provider.
  String get password;
}

class _SignInWithEmailProviderElement
    extends AutoDisposeFutureProviderElement<void> with SignInWithEmailRef {
  _SignInWithEmailProviderElement(super.provider);

  @override
  String get email => (origin as SignInWithEmailProvider).email;
  @override
  String get password => (origin as SignInWithEmailProvider).password;
}

String _$registerWithEmailHash() => r'daa857c996a4537703726634cf9ef0975ad40398';

/// See also [registerWithEmail].
@ProviderFor(registerWithEmail)
const registerWithEmailProvider = RegisterWithEmailFamily();

/// See also [registerWithEmail].
class RegisterWithEmailFamily extends Family<AsyncValue<void>> {
  /// See also [registerWithEmail].
  const RegisterWithEmailFamily();

  /// See also [registerWithEmail].
  RegisterWithEmailProvider call(
    String email,
    String password,
    String fullName,
  ) {
    return RegisterWithEmailProvider(
      email,
      password,
      fullName,
    );
  }

  @override
  RegisterWithEmailProvider getProviderOverride(
    covariant RegisterWithEmailProvider provider,
  ) {
    return call(
      provider.email,
      provider.password,
      provider.fullName,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'registerWithEmailProvider';
}

/// See also [registerWithEmail].
class RegisterWithEmailProvider extends AutoDisposeFutureProvider<void> {
  /// See also [registerWithEmail].
  RegisterWithEmailProvider(
    String email,
    String password,
    String fullName,
  ) : this._internal(
          (ref) => registerWithEmail(
            ref as RegisterWithEmailRef,
            email,
            password,
            fullName,
          ),
          from: registerWithEmailProvider,
          name: r'registerWithEmailProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$registerWithEmailHash,
          dependencies: RegisterWithEmailFamily._dependencies,
          allTransitiveDependencies:
              RegisterWithEmailFamily._allTransitiveDependencies,
          email: email,
          password: password,
          fullName: fullName,
        );

  RegisterWithEmailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.email,
    required this.password,
    required this.fullName,
  }) : super.internal();

  final String email;
  final String password;
  final String fullName;

  @override
  Override overrideWith(
    FutureOr<void> Function(RegisterWithEmailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: RegisterWithEmailProvider._internal(
        (ref) => create(ref as RegisterWithEmailRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        email: email,
        password: password,
        fullName: fullName,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<void> createElement() {
    return _RegisterWithEmailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is RegisterWithEmailProvider &&
        other.email == email &&
        other.password == password &&
        other.fullName == fullName;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, email.hashCode);
    hash = _SystemHash.combine(hash, password.hashCode);
    hash = _SystemHash.combine(hash, fullName.hashCode);

    return _SystemHash.finish(hash);
  }
}

mixin RegisterWithEmailRef on AutoDisposeFutureProviderRef<void> {
  /// The parameter `email` of this provider.
  String get email;

  /// The parameter `password` of this provider.
  String get password;

  /// The parameter `fullName` of this provider.
  String get fullName;
}

class _RegisterWithEmailProviderElement
    extends AutoDisposeFutureProviderElement<void> with RegisterWithEmailRef {
  _RegisterWithEmailProviderElement(super.provider);

  @override
  String get email => (origin as RegisterWithEmailProvider).email;
  @override
  String get password => (origin as RegisterWithEmailProvider).password;
  @override
  String get fullName => (origin as RegisterWithEmailProvider).fullName;
}

String _$signOutHash() => r'79e06cfa1cab882ec2c97d7f4625e069cf9d8fdd';

/// See also [signOut].
@ProviderFor(signOut)
final signOutProvider = AutoDisposeFutureProvider<void>.internal(
  signOut,
  name: r'signOutProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$signOutHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef SignOutRef = AutoDisposeFutureProviderRef<void>;
String _$authNotifierHash() => r'0ed5b3207953d06dd58ba06141b606ce85a4c5de';

/// See also [AuthNotifier].
@ProviderFor(AuthNotifier)
final authNotifierProvider =
    AutoDisposeNotifierProvider<AuthNotifier, AsyncValue<UserModel?>>.internal(
  AuthNotifier.new,
  name: r'authNotifierProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$authNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AuthNotifier = AutoDisposeNotifier<AsyncValue<UserModel?>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
