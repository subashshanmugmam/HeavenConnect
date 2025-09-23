import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../core/storage/storage_service.dart';

part 'theme_provider.g.dart';

@Riverpod(keepAlive: true)
class ThemeModeNotifier extends _$ThemeModeNotifier {
  @override
  ThemeMode build() {
    _loadThemeMode();
    return ThemeMode.system;
  }

  void _loadThemeMode() async {
    final storage = ref.read(storageServiceProvider);
    final themeIndex = await storage.getInt('theme_mode') ?? 0;
    state = ThemeMode.values[themeIndex];
  }

  Future<void> setThemeMode(ThemeMode themeMode) async {
    state = themeMode;
    final storage = ref.read(storageServiceProvider);
    await storage.setInt('theme_mode', themeMode.index);
  }

  void toggleTheme() {
    switch (state) {
      case ThemeMode.light:
        setThemeMode(ThemeMode.dark);
        break;
      case ThemeMode.dark:
        setThemeMode(ThemeMode.light);
        break;
      case ThemeMode.system:
        setThemeMode(ThemeMode.light);
        break;
    }
  }
}

@Riverpod(keepAlive: true)
bool isDarkMode(IsDarkModeRef ref) {
  final themeMode = ref.watch(themeModeNotifierProvider);
  final brightness = WidgetsBinding.instance.platformDispatcher.platformBrightness;
  
  switch (themeMode) {
    case ThemeMode.dark:
      return true;
    case ThemeMode.light:
      return false;
    case ThemeMode.system:
      return brightness == Brightness.dark;
  }
}