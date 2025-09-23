// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$isDarkModeHash() => r'f695847520fcb32e4d4fd4c4f7ae1eae10684420';

/// See also [isDarkMode].
@ProviderFor(isDarkMode)
final isDarkModeProvider = Provider<bool>.internal(
  isDarkMode,
  name: r'isDarkModeProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$isDarkModeHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef IsDarkModeRef = ProviderRef<bool>;
String _$themeModeNotifierHash() => r'c9036834dd98ed29832c05ebfc1710afbc8355ea';

/// See also [ThemeModeNotifier].
@ProviderFor(ThemeModeNotifier)
final themeModeNotifierProvider =
    NotifierProvider<ThemeModeNotifier, ThemeMode>.internal(
  ThemeModeNotifier.new,
  name: r'themeModeNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$themeModeNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ThemeModeNotifier = Notifier<ThemeMode>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member
