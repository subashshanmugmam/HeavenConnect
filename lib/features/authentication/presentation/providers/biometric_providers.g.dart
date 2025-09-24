// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'biometric_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$biometricServiceHash() => r'11ffe653aa126c397b1734cecdfbf464e3f61260';

/// Provider for biometric service
///
/// Copied from [biometricService].
@ProviderFor(biometricService)
final biometricServiceProvider = AutoDisposeProvider<BiometricService>.internal(
  biometricService,
  name: r'biometricServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$biometricServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef BiometricServiceRef = AutoDisposeProviderRef<BiometricService>;
String _$isBiometricAvailableHash() =>
    r'957384b24aa33a02499bb980da09e0958bece812';

/// Provider to check if biometric authentication is available
///
/// Copied from [isBiometricAvailable].
@ProviderFor(isBiometricAvailable)
final isBiometricAvailableProvider = AutoDisposeFutureProvider<bool>.internal(
  isBiometricAvailable,
  name: r'isBiometricAvailableProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$isBiometricAvailableHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef IsBiometricAvailableRef = AutoDisposeFutureProviderRef<bool>;
String _$isBiometricEnabledHash() =>
    r'429f1c71762e28a122d13129069e60923b44360e';

/// Provider to check if biometric authentication is enabled
///
/// Copied from [isBiometricEnabled].
@ProviderFor(isBiometricEnabled)
final isBiometricEnabledProvider = AutoDisposeFutureProvider<bool>.internal(
  isBiometricEnabled,
  name: r'isBiometricEnabledProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$isBiometricEnabledHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef IsBiometricEnabledRef = AutoDisposeFutureProviderRef<bool>;
String _$availableBiometricsHash() =>
    r'f8c470387e5857390e903db4758b7a950a111507';

/// Provider to get available biometric types
///
/// Copied from [availableBiometrics].
@ProviderFor(availableBiometrics)
final availableBiometricsProvider =
    AutoDisposeFutureProvider<List<BiometricType>>.internal(
  availableBiometrics,
  name: r'availableBiometricsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$availableBiometricsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef AvailableBiometricsRef
    = AutoDisposeFutureProviderRef<List<BiometricType>>;
String _$authenticateWithBiometricsHash() =>
    r'c2a99a3d19cb95fff75be558956140da0e5b89ac';

/// Provider for biometric authentication
///
/// Copied from [authenticateWithBiometrics].
@ProviderFor(authenticateWithBiometrics)
final authenticateWithBiometricsProvider =
    AutoDisposeFutureProvider<void>.internal(
  authenticateWithBiometrics,
  name: r'authenticateWithBiometricsProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$authenticateWithBiometricsHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef AuthenticateWithBiometricsRef = AutoDisposeFutureProviderRef<void>;
String _$enableBiometricHash() => r'68ef58083b13ddc44bf232ff9840de2cd3328d5d';

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

/// Provider to enable biometric authentication
///
/// Copied from [enableBiometric].
@ProviderFor(enableBiometric)
const enableBiometricProvider = EnableBiometricFamily();

/// Provider to enable biometric authentication
///
/// Copied from [enableBiometric].
class EnableBiometricFamily extends Family<AsyncValue<bool>> {
  /// Provider to enable biometric authentication
  ///
  /// Copied from [enableBiometric].
  const EnableBiometricFamily();

  /// Provider to enable biometric authentication
  ///
  /// Copied from [enableBiometric].
  EnableBiometricProvider call(
    String email,
    String password,
  ) {
    return EnableBiometricProvider(
      email,
      password,
    );
  }

  @override
  EnableBiometricProvider getProviderOverride(
    covariant EnableBiometricProvider provider,
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
  String? get name => r'enableBiometricProvider';
}

/// Provider to enable biometric authentication
///
/// Copied from [enableBiometric].
class EnableBiometricProvider extends AutoDisposeFutureProvider<bool> {
  /// Provider to enable biometric authentication
  ///
  /// Copied from [enableBiometric].
  EnableBiometricProvider(
    String email,
    String password,
  ) : this._internal(
          (ref) => enableBiometric(
            ref as EnableBiometricRef,
            email,
            password,
          ),
          from: enableBiometricProvider,
          name: r'enableBiometricProvider',
          debugGetCreateSourceHash:
              const bool.fromEnvironment('dart.vm.product')
                  ? null
                  : _$enableBiometricHash,
          dependencies: EnableBiometricFamily._dependencies,
          allTransitiveDependencies:
              EnableBiometricFamily._allTransitiveDependencies,
          email: email,
          password: password,
        );

  EnableBiometricProvider._internal(
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
    FutureOr<bool> Function(EnableBiometricRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: EnableBiometricProvider._internal(
        (ref) => create(ref as EnableBiometricRef),
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
  AutoDisposeFutureProviderElement<bool> createElement() {
    return _EnableBiometricProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is EnableBiometricProvider &&
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

mixin EnableBiometricRef on AutoDisposeFutureProviderRef<bool> {
  /// The parameter `email` of this provider.
  String get email;

  /// The parameter `password` of this provider.
  String get password;
}

class _EnableBiometricProviderElement
    extends AutoDisposeFutureProviderElement<bool> with EnableBiometricRef {
  _EnableBiometricProviderElement(super.provider);

  @override
  String get email => (origin as EnableBiometricProvider).email;
  @override
  String get password => (origin as EnableBiometricProvider).password;
}

String _$disableBiometricHash() => r'411e4466fbdb5bd66b740b7a87af01244b74a3e9';

/// Provider to disable biometric authentication
///
/// Copied from [disableBiometric].
@ProviderFor(disableBiometric)
final disableBiometricProvider = AutoDisposeFutureProvider<void>.internal(
  disableBiometric,
  name: r'disableBiometricProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$disableBiometricHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef DisableBiometricRef = AutoDisposeFutureProviderRef<void>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
