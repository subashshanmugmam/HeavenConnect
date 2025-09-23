// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$appStateHash() => r'133c286ab9a6622fc733b5ba23dd21451f2c7942';

/// See also [AppState].
@ProviderFor(AppState)
final appStateProvider = NotifierProvider<AppState, AppStateModel>.internal(
  AppState.new,
  name: r'appStateProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$appStateHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AppState = Notifier<AppStateModel>;
String _$authenticationStateHash() =>
    r'77a8475c8812368457ca75e74a81fe31fa413b86';

/// See also [AuthenticationState].
@ProviderFor(AuthenticationState)
final authenticationStateProvider =
    NotifierProvider<AuthenticationState, AuthStateModel>.internal(
  AuthenticationState.new,
  name: r'authenticationStateProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$authenticationStateHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$AuthenticationState = Notifier<AuthStateModel>;
String _$locationStateHash() => r'7ecd22220b0cfdb5530ab430c5f8ad1570caccca';

/// See also [LocationState].
@ProviderFor(LocationState)
final locationStateProvider =
    NotifierProvider<LocationState, LocationStateModel>.internal(
  LocationState.new,
  name: r'locationStateProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$locationStateHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$LocationState = Notifier<LocationStateModel>;
String _$connectivityStateHash() => r'fa8b8545859d482abfb7336e250ccc22a2710b82';

/// See also [ConnectivityState].
@ProviderFor(ConnectivityState)
final connectivityStateProvider =
    NotifierProvider<ConnectivityState, bool>.internal(
  ConnectivityState.new,
  name: r'connectivityStateProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$connectivityStateHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ConnectivityState = Notifier<bool>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
